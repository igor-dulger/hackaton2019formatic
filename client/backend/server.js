const configService = require('./services/ConfigService');
configService.loadWeb3(require('../../truffle.js'));
configService.loadDB(require("./knexfile.js"));
var log4js = require('log4js');

const syncService = require('./services/SyncService');
const storageService = require('./services/StorageService');
const restLogger = require('./services/LogService').rest;
const syncLogger = require('./services/LogService').sync;

const apiRouter = require("./routes/Api");
const webRouter = require("./routes/Web");
var bodyParser = require('body-parser');
var cors = require('cors');
const app = require('express')();
const express = require('express');

app.use(cors());
app.use(log4js.connectLogger(restLogger, { level: 'info' }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.text({ type: 'text/html' }));

app.use('/api', apiRouter);
app.use(express.static(__dirname + '/../build/'));
app.use('/', webRouter);

storageService.set("readChainTimeout", 1000 * 3600);
storageService.set("networkErrorTimeout", 1000 * 2);

// function wait(ms) {
//     var start = new Date().getTime();
//     var end = start;
//     while(end < start + ms) {
//         end = new Date().getTime();
//     }
// }
// wait(5000);

syncService.initWeb3()
    .then(syncService.getDeployBlockNumber)
    .then(syncService.readChain)
    .then(_ => {
        var timer = syncService.setReadChainTimer(storageService.readChainTimeout);
        app.listen(configService.syncServer.port, () => restLogger.info('App listening on port '+configService.syncServer.port+'!'))
    }).catch(syncLogger.error);