const ModelClass = require('../models/Models').Hash;
const EntityService = require('./EntityService');
const logger = require('./LogService').sync;
const DB = require("../orms/bookshelf");

class HashService extends EntityService {

    constructor(ModelClass) {
        super(ModelClass)
        this.entityName = "hash";
        this.indexField = "id";

        this.getLostHashes = this.getLostHashes.bind(this);
        this.getPrevExistingBlock = this.getPrevExistingBlock.bind(this);
        this.getNextExistingBlock = this.getNextExistingBlock.bind(this);
    }

    assignBlockchainData(id, hash, blockNumber, date) {
        return this.modelClass.forge({id: id}).fetch().then(model => {
            logger.debug("assignBlockchainData", id, hash, blockNumber, date)
            if (model) {
                model.set("updatedTxHash", hash);
                model.set("updatedBlockId", blockNumber);
                model.set("updatedDate", date);
                var options = {method: "update"}
            } else {
                model = this.modelClass.forge({
                    id: id,
                    donator_id: id,
                    createdTxHash: hash,
                    updatedTxHash: hash,
                    createdBlockId: blockNumber,
                    updatedBlockId: blockNumber,
                    createdDate: date,
                    updatedDate: date
                })
                var options = {method: "insert"}
            }
            return model.save(null, options);
        });
    }

    async getLostHashes(minBlock, maxBlock) {
        logger.debug("Get lost hashes from", minBlock, "to", maxBlock);
        let result = [];
        const rawRecords = await DB.knex.raw(`
            SELECT donators.id
            FROM donators
                LEFT JOIN hashes
                    ON (hashes.donator_id = donators.id)
            WHERE hashes.id is NULL
        `);
        let list = rawRecords[0];
        for (let i=0; i<list.length; i++) {
            let fromBlock = await this.getPrevExistingBlock(list[i].id, minBlock);
            let toBlock = await this.getNextExistingBlock(list[i].id, maxBlock);
            result.push({
                id: list[i].id,
                fromBlock: fromBlock,
                toBlock: toBlock,
            });
        }

        return result;
    }

    getPrevExistingBlock(id, minBlock){
        logger.debug("getPrevExistingBlock", id, minBlock);
        return this.modelClass.forge()
            .where("id", "<", id)
            .orderBy('id', 'DESC')
            .query(qb => {qb.limit(1)})
            .fetch().then(model => {
                return model ? model.get('createdBlockId') : minBlock
            });
    }

    getNextExistingBlock(id, maxBlock){
        logger.debug("getNextExistingBlock", id, maxBlock);
        return this.modelClass.forge()
            .where("id", ">", id)
            .orderBy('id', 'ASC')
            .query(qb => {qb.limit(1)})
            .fetch().then(model => {
                return model ? model.get('createdBlockId') : maxBlock
            });
    }
}

module.exports = new HashService(ModelClass);
