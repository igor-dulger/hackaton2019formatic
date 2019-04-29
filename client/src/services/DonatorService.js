import PendingService from "./PendingService";
import AppStorageService from "./AppStorageService";
import BlockchainService from "./BlockchainService";

var _ = require('lodash');

class DonatorService extends BlockchainService {

    newEntity() {
        return {
            id: 0,
            image: "",
            firstName: "",
            lastName: "",
            description: "",
            country: "",
            birthday: "",
            donatedDate: "",
            createdDate: "",
            updatedDate: "",
            identifier: "",
            createdTxHash: "",
            updatedTxHash: "",
            addedBlockId: 0,
            updatedBlockId: 0,
            facebook: "",
            linkedin: "",
            twitter: "",
            groups: [],
            groupsName: [],
            version: 0,
        }
    }

    newPendingEntity(entity, pendingMode) {
        //pendingMode - add, edit, delete
        return {...entity, pendingMode: pendingMode}
    }

    convertEntityToData(donator) {
        let tempDonator = {...donator};
        delete tempDonator['id'];
        delete tempDonator['version'];
        delete tempDonator['groups'];
        delete tempDonator['groupsName'];
        delete tempDonator['createdDate'];
        delete tempDonator['updatedDate'];
        delete tempDonator['createdTxHash'];
        delete tempDonator['updatedTxHash'];
        delete tempDonator['addedBlockId'];
        delete tempDonator['updatedBlockId'];
        delete tempDonator['donatedYear'];

        tempDonator['donatedDate'] = (new Date(tempDonator['donatedDate'])).getTime() / 1000;
        tempDonator['birthday'] = (new Date(tempDonator['birthday'])).getTime() / 1000;

        return tempDonator;
    }

    convertDataToEntity(donatorData) {
        let entity = {...donatorData};
        entity['donatedYear'] = (new Date(entity['donatedDate'] * 1000)).getFullYear();
        entity['donatedDate'] = (new Date(entity['donatedDate'] * 1000)).toISOString().substring(0, 10);
        entity['birthday'] = (new Date(entity['birthday'] * 1000)).toISOString().substring(0, 10);
        entity['createdDate'] = (new Date(entity['createdDate'] * 1000)).toISOString().substring(0, 10);
        entity['updatedDate'] = (new Date(entity['updatedDate'] * 1000)).toISOString().substring(0, 10);
        entity['groupsName'] = entity['groups'].map(group => group.name);
        entity['groups'] = entity['groups'].map(group => group.id);
        return entity;
    }

    addDonatorToBlockchain(donator) {
        let tempDonator = this.convertEntityToData(donator);
        return this.sendToBlockchain(
            AppStorageService.hallOfFameContract.methods.addDonatorAndLinkGroups(JSON.stringify(tempDonator), tempDonator.identifier, donator.groups),
            {from: AppStorageService.currentAccount}
        );
    }

    updateDonatorInBlockchain(donator) {
        console.log("Input", donator)
        let tempDonator = this.convertEntityToData(donator);
        console.log("tempDonator", tempDonator)
        return this.getDonator(donator.id).then(currentDonator => {
            var currentGroupIds = currentDonator.groups;
            console.log("currentGroupIds", currentGroupIds);
            console.log("newGroupIds", donator.groups);
            var deletedIds = _.difference(currentGroupIds, donator.groups);
            var addedIds = _.difference(donator.groups, currentGroupIds);
            console.log("addedIds", addedIds);
            console.log("deletedIds", deletedIds);

            return this.sendToBlockchain(
                AppStorageService.hallOfFameContract.methods.updateDonatorAndLinkGroups(
                    donator.id,
                    JSON.stringify(tempDonator, [
                        "image",
                        "firstName",
                        "lastName",
                        "description",
                        "country",
                        "birthday",
                        "donatedDate",
                        "identifier",
                        "facebook",
                        "linkedin",
                        "twitter"
                    ]),
                    tempDonator.identifier,
                    deletedIds,
                    addedIds
                ),
                {from: AppStorageService.currentAccount}
            );
        });
    }

    removeDonatorFromBlockchain(donator) {
        return this.sendToBlockchain(
            AppStorageService.hallOfFameContract.methods.removeDonator(donator.id),
            {from: AppStorageService.currentAccount}
        );
    }

    addDonator(donator) {
        return this.addDonatorToBlockchain(donator).then(() => {
            return PendingService.add('add', 'donator', donator);
        })
    }

    updateDonator(donator) {
        return this.updateDonatorInBlockchain(donator).then(() => {
            return PendingService.add('edit', 'donator', donator);
        })
    }

    removeDonator(donator) {
        return this.removeDonatorFromBlockchain(donator).then(() => {
            return PendingService.add('delete', 'donator', donator);
        })
    }

    addEndOfDayShift(date) {
        return date + 1000 * (23*60*60+59*60+59);
    }

    convertFilters(filters) {
        if (filters['createdDateFrom'] !== undefined) {
            filters['createdDateFrom'] = (new Date(filters['createdDateFrom'])).getTime() / 1000;
        }
        if (filters['createdDateTo'] !== undefined) {
            filters['createdDateTo'] = this.addEndOfDayShift((new Date(filters['createdDateTo'])).getTime()) / 1000;
        }

        if (filters['updatedDateFrom'] !== undefined) {
            filters['updatedDateFrom'] = (new Date(filters['updatedDateFrom'])).getTime() / 1000;
        }
        if (filters['updatedDateTo'] !== undefined) {
            filters['updatedDateTo'] = this.addEndOfDayShift((new Date(filters['updatedDateTo'])).getTime()) / 1000;
        }

        if (filters['birthdayFrom'] !== undefined) {
            filters['birthdayFrom'] = (new Date(filters['birthdayFrom'])).getTime() / 1000;
        }
        if (filters['birthdayTo'] !== undefined) {
            filters['birthdayTo'] = this.addEndOfDayShift((new Date(filters['birthdayTo'])).getTime()) / 1000;
        }

        if (filters['donatedDateFrom'] !== undefined) {
            filters['donatedDateFrom'] = (new Date(filters['donatedDateFrom'])).getTime() / 1000;
        }
        if (filters['donatedDateTo'] !== undefined) {
            filters['donatedDateTo'] = this.addEndOfDayShift((new Date(filters['donatedDateTo'])).getTime()) / 1000;
        }

        return filters;
    }

    getDonators(params) {
        return fetch(
            AppStorageService.backendURL + '/api/donators',
            {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.convertFilters(params))
            }
        )
            .then(response => response.json())
            .then(response => {
                response.result = response.result.map(this.convertDataToEntity);
                return response;
            })
    }

    getDonator(id) {
        return fetch(AppStorageService.backendURL + '/api/donator/' + id)
            .then(response => {
                return response.json()
            })
            .then(json => {
                return this.convertDataToEntity(json);
            })
    }


}

export default new DonatorService();