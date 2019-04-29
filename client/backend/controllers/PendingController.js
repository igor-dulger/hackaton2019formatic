const pendingService = require('./../services/PendingService');
const logger = require('../services/LogService').rest;

class PendingController {

    checkStatus(request, response) {

        if (!Array.isArray(request.body)) {
            response.status(400).send("Array of pendings was expected")
            logger.trace("invalid array of pendings");
            return
        }

        pendingService.checkStatus(request.body).then(res => {
            response.json(res);
        }).catch(err => {
            logger.info(err);
            this.send500Error(response);
        });
    }
}

module.exports = new PendingController();
