const modelClass = require('../models/Models').Admin;
const EntityService = require('./EntityService');
const logger = require('./LogService').sync;

class AdminService extends EntityService {

    constructor(modelClass) {
        super(modelClass)
        this.entityName = "admin"
        this.indexField = "address"
    }

    mapChainToModel(record) {
        try {
            var data = JSON.parse(record.data);
        } catch(err) {
            var data = {
                nickname: "",
                data: record.data
            }
            logger.error("Admin JSON parsing error", record.id, "["+record.data+"]", err);
        }
        return {
            id: record.id,
            nickname: data.nickname.substring(0, 255),
            version: record.version,
            address: record.index,
            data: record.data
        }
    }
}

module.exports = new AdminService(modelClass);
