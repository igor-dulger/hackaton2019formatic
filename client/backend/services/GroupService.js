const ModelClass = require('../models/Models').Group;
const EntityService = require('./EntityService');
const logger = require('./LogService').sync;
const DB = require("../orms/bookshelf");

class GroupService extends EntityService {

    constructor(ModelClass) {
        super(ModelClass)
        this.entityName = "group";
        this.indexField = "code";

        this.donators = this.donators.bind(this);
        this.clearDonators = this.clearDonators.bind(this);
        this.assignDonators = this.assignDonators.bind(this);
        this.moveDonator = this.moveDonator.bind(this);
    }

    mapChainToModel(record) {
        try {
            var data = JSON.parse(record.data);
        } catch(err) {
            var data = {
                name: "",
                description: "",
                data: record.data
            }
            logger.error("Group JSON parsing error", record.id, "["+record.data+"]", err);
        }

        return {
            id: record.id,
            code: record.index,
            name: data.name.substring(0, 255),
            description: data.description.substring(0, 255),
            version: record.version,
            data: record.data
        }
    }

    donators(id) {
        return DB.knex.raw(`
            SELECT donator_id
            FROM donators_groups
            WHERE group_id = ?
            ORDER BY position ASC
        `, id).then(res => {
            return res[0].map(el => el.donator_id);
        });
    }

    clearDonators(groupId) {
        logger.debug("clearDonators", groupId);
        return DB.knex.raw(`DELETE FROM donators_groups WHERE group_id = ?`, groupId)
        .then(res => {
            return res[0].affectedRows;
        });
    }

    deleteAll() {
        logger.debug("Delete all groups");
        return super.deleteAll().then(this.clearAllDonators);
    }

    clearAllDonators() {
        logger.debug("clearAllDonators");
        return DB.knex.raw(`DELETE FROM donators_groups`)
        .then(res => {
            return res[0].affectedRows;
        });
    }

    assignDonators(groupId, ids) {
        logger.debug("assignDonatorsToGroups", groupId, "count:", ids.length);
        return this.modelClass.forge({id: groupId})
            .donators()
            .attach(ids.map((el,i) => {
                return {group_id: groupId, donator_id: el, position: i+1}
            }));
    }

    moveDonator(id, donatorId, to) {
        logger.debug("moveDonator", id, donatorId, to)
        return DB.knex.raw(`
            SELECT (SELECT position
                    FROM donators_groups
                    WHERE group_id = ?
                    AND donator_id = ?) AS from_pos,
                    (SELECT position
                    FROM donators_groups
                    WHERE group_id = ?
                    AND donator_id = ?) as to_pos
            `, [id, donatorId, id, to])
            .then(res => {
                let from_pos = res[0][0].from_pos;
                let to_pos = res[0][0].to_pos;
                if (from_pos < to_pos) {
                    return DB.knex.transaction(trx => {
                        return trx.raw(`
                            UPDATE donators_groups
                            SET position = position - 1
                            WHERE group_id = :group_id
                            AND position > :from_pos
                            AND position <= :to_pos
                        `, {group_id: id, from_pos: from_pos, to_pos: to_pos})
                        .then(_=>{
                            return trx.raw(`
                                UPDATE donators_groups
                                SET position = :to_pos
                                WHERE group_id = :group_id
                                AND donator_id = :donator_id
                            `, {group_id: id, donator_id: donatorId, to_pos: to_pos});
                        }).then(trx => trx.commit);
                    });
                } else {
                    return DB.knex.transaction(trx => {
                        return trx.raw(`
                            UPDATE donators_groups
                            SET position = position + 1
                            WHERE group_id = :group_id
                            AND position < :from_pos
                            AND position > :to_pos
                        `, {group_id: id, from_pos: from_pos, to_pos: to_pos})
                        .then(_ => {
                            return trx.raw(`
                                UPDATE donators_groups
                                SET position = :to_pos + 1
                                WHERE group_id = :group_id
                                AND donator_id = :donator_id
                            `, {group_id: id, donator_id: donatorId, to_pos: to_pos})
                        }).then(trx => trx.commit);
                    });
                }
            });
    }
}

module.exports = new GroupService(ModelClass);
