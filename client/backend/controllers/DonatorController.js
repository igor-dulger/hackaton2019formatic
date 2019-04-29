const donatorService = require('./../services/DonatorService');
const logger = require('../services/LogService').rest;
const BasicController = require('./BasicController');

class DonatorController extends BasicController{
    constructor(entityService) {
        super(entityService);
        this.convertModel = this.convertModel.bind(this);
        this.get = this.get.bind(this);
        this.list = this.list.bind(this);
    }

    get(request, response) {
        this.entityService.get(request.params.id).then(res => {
            response.json(this.convertModel(res));
        }).catch(err => {
            logger.info(err);
            this.send500Error(response);
        });
    }

    /***
    Request
    {
        "groupId": "2",
        "firstName": "Donator2 firstName",
    	"lastName": "Donator2 lastName",
    	"country": "USA",
    	"createdDateFrom": 1550836477,
    	"createdDateTo": 1550836477,
    	"updatedDateFrom": 1550836477,
    	"updatedDateTo": 1550836477,
    	"birthdayFrom": 1550836477,
    	"birthdayTo": 1550836477,
    	"donatedDateFrom": 1550836477,
    	"donatedDateTo": 1550836477,
    	"searchQuery": "first or last name",
        "order": {
        	"field": "id" | firstName | lastName | createdDate | updatedDate | position
        	"direction": "desc" | asc
        },
        "pageSizse": 2,
        "page": 1
    }
    Response
    {
        "result": [
            {
                "id": 1,
                "donatorId": 1,
                "createdTxHash": "0xbdc6814dcb066ebc4b9830d326ec02ff2df4a96f5d21876a18a64e25958103d6",
                "createdBlockId": 2081,
                "createdDate": 1550836477,
                "updatedTxHash": "0xbdc6814dcb066ebc4b9830d326ec02ff2df4a96f5d21876a18a64e25958103d6",
                "updatedBlockId": 2081,
                "updatedDate": 1550836477,
                "createdAt": "2019-02-22T16:33:48.000Z",
                "updatedAt": "2019-02-22T16:33:48.000Z",
                "firstName": "Donator0 firstName",
                "lastName": "Donator0 lastName",
                "country": "USA",
                "birthday": 1550836477,
                "donatedDate": 1550836477,
                "identifier": "donatorId_0",
                "image": "",
                "facebook": "",
                "linkedin": "",
                "twitter": "",
                "version": 1
            },
            ......
        ],
        "pagination": {
            "page": 1,
            "pageSize": 10,
            "rowCount": 16,
            "pageCount": 2
        }
    }
    */

    list(request, response) {
        donatorService.getList(request.method == 'GET' ? request.query : request.body)
            .then(res => {
                response.json({
                    result: res.map(el => this.convertModel(el)),
                    pagination: res.pagination
                });
            }).catch(err => {
                logger.info(err);
                this.send500Error(response);
            });
    }

    convertModel(model) {
        model = model.toJSON()
        let result = {...model.hash, ...model};
        delete result.hash
        return result
    }
}

module.exports = new DonatorController(donatorService);
