const groupService = require('./../services/GroupService');
const BasicController = require('./BasicController');
const logger = require('../services/LogService').rest;

class GroupController extends BasicController{
    constructor (entityService) {
        super(entityService);
    }

    donators(request, response) {
        this.entityService.donators(request.params.id).then(res => {
            response.json(res);
        }).catch(err => {
            logger.info(err);
            this.send500Error(response);
        });
    }
}

module.exports = new GroupController(groupService);
