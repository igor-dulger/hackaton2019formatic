const logger = require('../services/LogService').rest;

class BasicController {

    constructor(entityService) {
        this.entityService = entityService;
        this.get = this.get.bind(this);
        this.list = this.list.bind(this);
    }

    get(request, response) {
        if (isNaN(request.params.id)) {
            response.status(400).send("invalid id")
            logger.trace("invalid id");
            return
        }

        this.entityService.get(request.params.id).then(res => {
            if (res) {
                response.json(res);
            } else {
                response.status(400).send("Not found")
            }
        }).catch(err => {
            logger.error(err);
            this.send500Error(response);
        });
    }

    list(request, response) {
        this.entityService.getList(request.body).then(res => {
            response.json(res);
        }).catch(err => {
            logger.error(err);
            this.send500Error(response);
        });
    }

    send500Error(response) {
        response.status(500).send("Something bad happened");
    }
}

module.exports = BasicController;
