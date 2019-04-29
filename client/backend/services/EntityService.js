const logger = require('./LogService').sync;

class EntityService {

    constructor(modelClass) {
        this.modelClass = modelClass;
        this.entityName = "Entity";
        this.indexField = "EntityIndexField";

        this.save = this.save.bind(this);
        this.get = this.get.bind(this);
        this.getList = this.getList.bind(this);
        this.mapChainToModel = this.mapChainToModel.bind(this);
    }

    mapChainToModel(record) {
        return {};
    }

    add(record) {
        logger.debug("Add ", this.entityName, record.id);
        try {
            return this.modelClass.forge(this.mapChainToModel(record))
                .save(null, {method: "insert"})
                .then(model => {
                    logger.debug(this.entityName, "added", model.get('id'));
                    return model.get('id');
                })
        } catch(err) {
            logger.error("Can't add", this.entityName, record.id, err);
            return null;
        }
    }

    update(record) {
        logger.debug("Update", this.entityName, record.id);
        try {
            return this.modelClass.forge(this.mapChainToModel(record))
                .save(null, {method: "update"})
                .then(model => {
                    logger.debug(this.entityName, "updated", model.get('id'));
                    return model.get('id');
                })
        } catch(err) {
            logger.error("Can't update", this.entityName, record.id, err);
            return null;
        }
    }

    delete(id) {
        logger.debug("Delete", this.entityName, id);
        return this.modelClass.forge({id: id}).destroy({require: false}).then(model => {
            logger.debug(this.entityName, "deleted", id);
            return id;
        })
    }

    deleteAll() {
        logger.debug("Delete all", this.entityName);
        return this.modelClass.forge().where('id', '!=', '0').destroy({require: false}).then(model => {
            logger.debug("All", this.entityName, "records were deleted");
            return true;
        })
    }

    save(record) {
        return this.get(record.id).then(model => {
            return model ? this.update(record) : this.add(record);
        });
    }

    get(id) {
        return this.modelClass.forge({id: id}).fetch();
    }

    findByIndex(index) {
        let filter = {};
        filter[this.indexField] = index;
        return this.modelClass.forge(filter).fetch();
    }

    getList(filters) {
        return this.modelClass.where(1,1).fetchAll();
    }
}

module.exports = EntityService;
