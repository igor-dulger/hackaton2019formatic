const adminService = require('../services/AdminService');
const BasicController = require('./BasicController');
const logger = require('../services/LogService').rest;

class AdminController extends BasicController {
    constructor(entityService) {
        super(entityService);
    }
}

module.exports = new AdminController(adminService);
