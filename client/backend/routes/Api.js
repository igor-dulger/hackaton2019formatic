const express = require('express');
const app = express();
const Router = express.Router();

const AdminController = require('../controllers/AdminController');
const GroupController = require('../controllers/GroupController');
const DonatorController = require('../controllers/DonatorController');
const PendingController = require('../controllers/PendingController');

Router.route('/admin/:id').get(AdminController.get);
Router.route('/admins').get(AdminController.list);

Router.route('/group/:id').get(GroupController.get);
Router.route('/groups').get(GroupController.list);
Router.route('/group/:id/donators').get(GroupController.donators);

Router.route('/donator/:id').get(DonatorController.get);
Router.route('/donators').get(DonatorController.list);
Router.route('/donators').post(DonatorController.list);

Router.route('/pendings').post(PendingController.checkStatus);

module.exports = Router;
