const adminService = require('./AdminService');
const donatorService = require('./DonatorService');
const groupService = require('./GroupService');
const logger = require('./LogService').rest;

class Pending {
    constructor() {
        this.checkStatus = this.checkStatus.bind(this);
        this.checkAdd = this.checkAdd.bind(this);
        this.checkEdit = this.checkEdit.bind(this);
        this.checkDelete = this.checkDelete.bind(this);

        this.allowedEntityTypes = ['admin', 'group', 'donator'];
        this.allowedTypes = ['add', 'edit', 'delete'];
    }

    validate(el) {
        if (el.pending.body == undefined) {
            return "Invalid request format";
        }
        let body = el.pending.body;

        if (this.allowedEntityTypes.indexOf(body.entityType) == -1) {
            return "Unknown entityType " + body.entityType;
        }

        if (this.allowedTypes.indexOf(body.type) == -1) {
            return "Unknown type " + body.type;
        }

        if (body.identifier == undefined ) {
            return "Invalid undefined";
        }
    }

    async checkStatus(list) {
        var result = [];
        for (let i=0; i<list.length; i++) {
            let el = {
                pending: list[i],
                completed: false,
            };

            if (this.validate(el)) {
                el.error = this.validate(el);
            };

            if (el.error == undefined) {
                let entityService;
                switch (el.pending.body.entityType) {
                    case 'admin':
                        entityService = adminService;
                        break;
                    case 'group':
                        entityService = groupService;
                        break;
                    case 'donator':
                        entityService = donatorService;
                        break;
                }
                // logger.trace("Check pending", el.pending.body, entity);

                switch (el.pending.body.type) {
                    case 'add':
                        el = this.checkAdd(el, await entityService.findByIndex(el.pending.body.identifier));
                        break;
                    case 'edit':
                        el = this.checkEdit(el, await entityService.get(el.pending.body.identifier));
                        break;
                    case 'delete':
                        el = this.checkDelete(el, await entityService.get(el.pending.body.identifier));
                        break;
                }
            }
            result.push(el);
        }
        return result;
    }

    checkAdd(el, entity) {
        // logger.trace("checkAdd", el, entity)
        if (entity != null) {
            el.completed = true;
        }
        return el;
    }

    checkEdit(el, entity) {
        if (entity != null && entity.get('version') > el.pending.body.version) {
            el.completed = true;
        }
        return el;
    }

    checkDelete(el, entity) {
        // logger.trace("checkDelete", el, entity)
        if (entity == null) {
            el.completed = true;
        }
        return el;
    }
}

module.exports = new Pending();
