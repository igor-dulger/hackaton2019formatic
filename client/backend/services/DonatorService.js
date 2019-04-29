const EntityService = require('./EntityService');
const ModelClass = require('../models/Models').Donator;
const DB = require("../orms/bookshelf");
const logger = require('./LogService').sync;
const restLogger = require('./LogService').sync;

class DonatorService extends EntityService {

    constructor(modelClass) {
        super(modelClass)
        this.entityName = "donator";
        this.indexField = "identifier";
    }

    mapChainToModel(record) {
        logger.debug("Get from chain", record)
        try {
            var data = JSON.parse(record.data);
        } catch(err) {
            var data = {
                nickname: "",
                firstName: "",
                lastName: "",
                country: "",
                birthday: "",
                donated_date: "",
                image: "",
                facebook: "",
                linkedin: "",
                twitter: "",
                description: "",
                data: record.data
            }
            logger.error("Donator JSON parsing error", record.id, "["+record.data+"]", err);
        }

        var data = JSON.parse(record.data);
        data.birthday = data.birthday % 99999999999;
        data.donatedDate = data.donatedDate % 99999999999;
        return {
            id: record.id,
            firstName: data.firstName.substring(0, 255),
            lastName: data.lastName.substring(0, 255),
            country: data.country.substring(0, 255),
            birthday: (Number.isInteger(data.birthday) ? new Date(data.birthday*1000).getTime() : new Date(0).getTime())/1000,
            donated_date: (Number.isInteger(data.donatedDate) ? new Date(data.donatedDate*1000).getTime() : new Date(0).getTime())/1000,
            image: data.image.substring(0, 255),
            facebook: data.facebook.substring(0, 255),
            linkedin: data.linkedin.substring(0, 255),
            twitter: data.twitter.substring(0, 255),
            version: record.version,
            identifier: record.index,
            description: data.description,
            data: record.data
        }
    }

    addToGroups(id, groupIds) {
        logger.debug("addToGroups", id, groupIds);
        return DB.knex.raw(`
            SELECT groups.id, ifnull(max(position), 0) position
            FROM groups
            LEFT JOIN donators_groups
              ON (groups.id = donators_groups.group_id)
            WHERE id in (?)
            GROUP BY groups.id
        `, [groupIds]).then(res => {
            let ids = res[0].map(el => {
                return {
                    group_id: el.id,
                    position: el.position+1
                }
            });
            logger.debug(ids);
            return this.modelClass.forge({id: id}).groups().attach(ids);
        });
    }

    deleteFromGroups(id, groupIds) {
        logger.debug("deleteFromGroups", id, groupIds);
        return this.modelClass.forge({id: id}).groups().detach(groupIds);
    }

    get(id) {
        return this.modelClass.forge({id: id}).fetch({withRelated: ['hash', 'groups']});
    }

    getList(filters) {
        const allowedOrderFields = {
            id: 'donators.id',
            firstName: 'donators.first_name',
            lastName: 'donators.last_name',
            createdDate: 'hashes.created_date',
            updatedDate: 'hashes.updated_date',
            position: 'donators_groups.position'
        }
        const allowedOrderDirections = {
            asc: 'ASC',
            desc: 'DESC'
        }

        restLogger.debug("get list", this.entityName, filters);

        var query = this.modelClass.query(function (qb) {
            qb.leftJoin('hashes', 'hashes.id', 'donators.id');
            qb.leftJoin('donators_groups', 'donators_groups.donator_id', 'donators.id');
            if (filters.id !== undefined) {
                qb.where("donators.id", filters.id);
            }
            if (filters.idFrom !== undefined) {
                qb.where("donators.id", ">=", filters.idFrom);
            }
            if (filters.idTo !== undefined) {
                qb.where("donators.id", "<=", filters.idTo);
            }
            if (filters.groupId) {
                qb.where("donators_groups.group_id", filters.groupId);
            }
            if (filters.notInGroups) {
                qb
                    .whereNotIn("donators_groups.group_id", filters.notInGroups.split(";"))
                    .orWhereNull("donators_groups.group_id");
            }
            if (filters.firstName) {
                qb.where("first_name", "like", filters.firstName+"%");
            }
            if (filters.lastName) {
                qb.where("last_name", "like", filters.lastName+"%");
            }
            if (filters.country) {
                qb.where("country", "like", filters.country);
            }
            if (filters.identifier) {
                qb.where("identifier", "like", filters.identifier+"%");
            }
            if (filters.createdDateFrom) {
                qb.where("created_date", ">=", filters.createdDateFrom);
            }
            if (filters.createdDateTo) {
                qb.where("created_date", "<=", filters.createdDateTo);
            }
            if (filters.updatedDateFrom) {
                qb.where("updated_date", ">=", filters.updatedDateFrom);
            }
            if (filters.updatedDateTo) {
                qb.where("updated_date", "<=", filters.updatedDateTo);
            }
            if (filters.birthdayFrom) {
                qb.where("birthday", ">=", filters.birthdayFrom);
            }
            if (filters.birthdayTo) {
                qb.where("birthday", "<=", filters.birthdayTo);
            }
            if (filters.donatedDateFrom) {
                qb.where("donated_date", ">=", filters.donatedDateFrom);
            }
            if (filters.donatedDateTo) {
                qb.where("donated_date", "<=", filters.donatedDateTo);
            }
            if (filters.searchQuery) {
//                qb.whereRaw("MATCH (first_name, last_name) AGAINST (? IN NATURAL LANGUAGE MODE)", filters.searchQuery);
                qb.whereRaw("MATCH (first_name, last_name) AGAINST (? IN BOOLEAN MODE)", filters.searchQuery.split(' ').map(el => el+'*').join(' '));
            }

            qb.groupBy('donators.id');
        });

        if (filters.order) {
            let field = allowedOrderFields[filters.order.field];
            let direction = allowedOrderDirections[filters.order.direction];
            if (field) {
                query = query.orderBy(field, direction ? direction : 'ASC')
            }
        }

        return query.fetchPage({
            pageSize: filters.pageSize ? filters.pageSize : 10,
            page: filters.page ? filters.page : 1,
            withRelated: ['hash', 'groups']
       });
    }
}

module.exports = new DonatorService(ModelClass);
