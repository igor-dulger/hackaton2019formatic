const storage = require('./StorageService');
const configService = require('./ConfigService');
const logger = require('./LogService').sync;

const hallOfFame = require('../../src/contracts/HallOfFame.json');
const web3 = require('web3');

const entityServices = {
    Admin: require('./AdminService'),
    Donator: require('./DonatorService'),
    Group: require('./GroupService'),
    Hash: require('./HashService'),
}

class SyncService {

    constructor (){
        this.getAll = this.getAll.bind(this);
        this.setEventHandler = this.setEventHandler.bind(this);
        this.handleDataEvents = this.handleDataEvents.bind(this);
        this.handleChangedEvents = this.handleChangedEvents.bind(this);

        this.getAllGroupsDonators = this.getAllGroupsDonators.bind(this);
        this.getGroupDonators = this.getGroupDonators.bind(this);
        this.getRecords = this.getRecords.bind(this);
        this.getNext = this.getNext.bind(this);
        this.restoreMissedHashes = this.restoreMissedHashes.bind(this);
        this.readChain = this.readChain.bind(this);
        this.setReadChainTimer = this.setReadChainTimer.bind(this);

        this.initWeb3 = this.initWeb3.bind(this);
        this.resetWeb3 = this.resetWeb3.bind(this);
    }

    initWeb3() {
        logger.debug("Init web3");
        delete storage.web3;
        var web3js = new web3(new web3.providers.WebsocketProvider(configService.syncServer.websocketProvider));
        logger.debug("Get network id");
        return web3js.eth.net.getId().then(networkId => {
            logger.debug("NetworkId", networkId, "init contract");
            const contract = new web3js.eth.Contract(hallOfFame.abi, hallOfFame.networks[networkId].address);
            storage.set('transactionHash', hallOfFame.networks[networkId].transactionHash);
            storage.set('web3', web3js);
            storage.set('contract', contract);
        }).catch(err => {
            logger.error(err);
            process.exit();
        });
    }

    getDeployBlockNumber() {
        logger.debug("Get deploy block number");
        return storage.web3.eth.getTransaction(storage.transactionHash).then(tx => {
            storage.set('deployBlockNumber', tx.blockNumber);
        });
    }

    getStartBlockNumber() {
        logger.debug("Get start block number");
        return storage.web3.eth.getBlockNumber().then(res => {
            storage.set('startBlockNumber', res)
        });
    }

    resetWeb3() {
        logger.warn("Reset web3. Restart server")
        process.exit(1);
        storage.events = null;
        delete storage.web3;
        delete storage.contract;
        return this.initWeb3().catch(err => {
            logger.error("Reset web3 failed with error", err);
        });
        // return this.unsetEventHandler()
        //     .then(this.initWeb3).catch(err => {
        //     // .then(this.setEventHandler).catch(err => {
        //         logger.error("Reset web3 failed with error", err);
        //         // return new Promise((resolve, reject) => {
        //         //     logger.debug("Set timeout to reset web3", storage.networkErrorTimeout);
        //         //     setTimeout(
        //         //         _=>{resolve(this.resetWeb3())},
        //         //         storage.networkErrorTimeout
        //         //     );
        //         // });
        //     });
    }

    readChain() {
        logger.debug("Read chain");
        return this.unsetEventHandler()
            .then(this.getStartBlockNumber)
            .then(this.getAll)
            .then(this.setEventHandler)
            .then(this.restoreMissedHashes)
            .catch(err => {
                logger.error("Read chain error", err, "try to reset web3");
                return this.resetWeb3().then(this.readChain);
            })
    }

    setReadChainTimer(timeout) {
        return setTimeout(_ => {
            this.readChain().then(_ => {this.setReadChainTimer(timeout)});
        }, timeout);
    }

    setEventHandler() {
        logger.debug("Setup event handler, from block", storage.startBlockNumber);

        if (storage.events !== null) {
            logger.debug("Event handler already exists");
            return storage.events;
        }

        storage.events = storage.contract.events.allEvents({fromBlock: storage.startBlockNumber+1})
            .on('data', (event) => {
                this.handleDataEvents(event).catch(err => {
                    logger.error("data event error", err)
                    this.resetWeb3().then(this.readChain).then(_ => {
                        logger.debug("Chain rereaded and restored");
                    })
                });
            }).on('changed', (event) => {
                this.handleChangedEvents(event).catch(err => {
                    logger.error("data event error", err)
                    this.resetWeb3().then(this.readChain).then(_ => {
                        logger.debug("Chain rereaded and restored");
                    })
                });
            }).on('error', (error) => {
                logger.error(error);
                resetWeb3().then(this.readChain);
            });
        return storage.events;
    }

    unsetEventHandler() {
        logger.debug("unsetEventHandler start")
        return new Promise((resolve, reject) => {
            if (storage.events === null) {
                logger.debug("unsetEventHandler no subscription were found")
                resolve(false);
            }

            logger.debug("first attempt")
            storage.events.unsubscribe(function(error, success){
                if(success) {
                    logger.debug('Events were successfully unsubscribed!');
                    storage.events = null;
                    resolve(true);
                } else {
                    logger.error("Couldn't unsubscribe events!", error)
                    reject(true)
                }
            });
        })
    }

    getAll() {
        logger.debug("Get all data");

        return Promise.all([
            this.getRecords("Donator", 0),
            this.getRecords("Group", 0),
            this.getRecords("Admin", 0)
        ])
        .then(() => {
            return this.getAllGroupsDonators();
        }).catch(err => {
            logger.error("Get all error", err);
            return true;
        });
;
    }

    getAllGroupsDonators() {
        logger.debug("Get donators in groups in order");
        return entityServices.Group.getList().then(groups => {
            var groupIds = groups.map(el => el.id);
            var requests = [];
            for (var i=0; i<groupIds.length; i++){
                requests.push(this.getGroupDonators(groupIds[i]));
            }
            return Promise.all(requests);
        })
    }

    async getGroupDonators(groupId) {
        logger.debug("Get donators in order for group", groupId);
        var ids = [];
        var res = await this.getNextGroupDonatorsList(groupId, 0);
        ids = ids.concat(res.ids);
        while(res.lastId > 0) {
            res = await this.getNextGroupDonatorsList(groupId, res.lastId);
            ids = ids.concat(res.ids);
        }
        await entityServices.Group.clearDonators(groupId);
        await entityServices.Group.assignDonators(groupId, ids);
        return true;
    }

    getNextGroupDonatorsList(groupId, donatorId) {
        let listSize = 1000;
        return storage.contract.methods.getGroupDonators(groupId, donatorId, listSize)
            .call()
            .then(list => {
                var ids = list.filter(el => el > 0);
                return {
                    lastId: (list[list.length-1] != 0  ? ids[ids.length-1] : 0),
                    ids: ids
                }
            });
    }

    async getRecords(entity) {
        logger.debug("Get all " + entity + " start");
        await entityServices[entity].deleteAll();

        var id = await this.getNext(entity, 0);
        while(id > 0){
            id = await this.getNext(entity, id);
        }
        return true;
    }

    getNext(entity, id) {
        return storage.contract.methods['next' + entity](id).call()
        .then((nextId) => {
            if (nextId != 0) {
                logger.debug("Get next", entity, nextId);
                return this.getEntityAndSave(entity, nextId);
            } else {
                return new Promise((resolve, reject) => {resolve(nextId)});
            }
        })
    }

    getEntityAndSave(entity, id) {
        return storage.contract.methods['get' + entity](id).call()
        .then((res) => {
            logger.debug("Get " + entity + " record " + res.id);
            return entityServices[entity].save(res);
        });
    }

    async restoreMissedHashes() {
        logger.debug("Start restore hashes");

        var donators = await entityServices.Hash.getLostHashes(storage.deployBlockNumber, storage.startBlockNumber);
        donators.forEach(donator => {
            logger.debug("Get past events for", donator);
            storage.contract.getPastEvents('DonatorAdded', {
                filter: {id: donator.id},
                fromBlock: donator.fromBlock,
                toBlock: donator.toBlock
            }).then((events) => {
                this.restoreHash(events[0]);
            }).catch((error) => {
                logger.error("Can't hash restore, no event found for id", donator.id);
            });
        });
        logger.debug("Restore hashes from", storage.deployBlockNumber);
        return true;
    }

    restoreHash(event) {
        storage.web3.eth.getBlock(event.blockNumber).then(block => {
            logger.debug("Restore donator", event.returnValues.id, "hash", event.transactionHash, event.blockNumber);
            entityServices.Hash.assignBlockchainData(
                event.returnValues.id,
                event.transactionHash,
                event.blockNumber,
                block.timestamp
            )
        });
    }

    handleDataEvents(event) {
        logger.debug("handleDataEvents", event.event)
//        if (event.type != 'mined') { return new Promise((resolve, reject) => {resolve(true);}); } doesnt work in Rinkeby network
        switch (event.event) {
            case 'DonatorAdded':
                return this.getEntityAndSave("Donator", event.returnValues.id)
                .then(_ => {
                    entityServices.Hash.assignBlockchainData(
                        event.returnValues.id,
                        event.transactionHash,
                        event.blockNumber,
                        Math.round(new Date().getTime() / 1000)
                    )
                });
            case 'DonatorUpdated':
                return this.getEntityAndSave("Donator", event.returnValues.id)
                .then(_ => {
                    entityServices.Hash.assignBlockchainData(
                        event.returnValues.id,
                        event.transactionHash,
                        event.blockNumber,
                        Math.round(new Date().getTime() / 1000)
                    )
                });
            case 'DonatorDeleted':
                return entityServices.Donator.delete(event.returnValues.id);
            case 'AdminAdded':
                return this.getEntityAndSave("Admin", event.returnValues.id);
            case 'AdminUpdated':
                return this.getEntityAndSave("Admin", event.returnValues.id);
            case 'AdminDeleted':
                return entityServices.Admin.delete(event.returnValues.id);
            case 'GroupAdded':
                // return Promise.reject(false);
                return this.getEntityAndSave("Group", event.returnValues.id);
            case 'GroupUpdated':
                return this.getEntityAndSave("Group", event.returnValues.id);
            case 'GroupDeleted':
                return entityServices.Group.delete(event.returnValues.id);
            case 'DonatorAddedToGroups':
                return entityServices.Donator.addToGroups(
                    event.returnValues.donatorId,
                    event.returnValues.groupIds
                );
            case 'DonatorRemovedFromGroups':
                return entityServices.Donator.deleteFromGroups(
                    event.returnValues.donatorId,
                    event.returnValues.groupIds
                );
            case 'DonatorMovedInGroup':
                return entityServices.Group.moveDonator(
                    event.returnValues.groupId,
                    event.returnValues.donatorId,
                    event.returnValues.to
                );
            default:
        }
        logger.debug("Event was handled", event.event, event.returnValues);
    }

    handleChangedEvents(event) {
        logger.debug("handleChangedEvents", event.event)
        if (event.removed != true) { return; }
        switch (event.event) {
            case 'DonatorAdded':
                return entityServices.Donator.delete(event.returnValues.id);
            case 'DonatorUpdated':
                return this.getEntityAndSave("Donator", event.returnValues.id);
            case 'DonatorDeleted':
                return this.getEntityAndSave("Donator", event.returnValues.id).then(this.restoreMissedHashes);
            case 'AdminAdded':
                return entityServices.Admin.delete(event.returnValues.id);
            case 'AdminUpdated':
                return this.getEntityAndSave("Admin", event.returnValues.id);
            case 'AdminDeleted':
                return this.getEntityAndSave("Admin", event.returnValues.id);
            case 'GroupAdded':
                return entityServices.Group.delete(event.returnValues.id);
            case 'GroupUpdated':
                return this.getEntityAndSave("Group", event.returnValues.id);
            case 'GroupDeleted':
                return this.getEntityAndSave("Group", event.returnValues.id);
            case 'DonatorAddedToGroups':
                return entityServices.Donator.deleteFromGroups(
                    event.returnValues.donatorId,
                    event.returnValues.groupIds
                );
            case 'DonatorRemovedFromGroups':
                return entityServices.Donator.addToGroups(
                    event.returnValues.donatorId,
                    event.returnValues.groupIds
                );
            case 'DonatorMovedInGroup':
                return this.getGroupDonators(event.returnValues.groupId);
            default:
        }
        logger.debug("Event was handled", event.event, event.returnValues);
    }

}

module.exports = new SyncService();
