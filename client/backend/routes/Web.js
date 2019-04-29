const express = require('express');
const Router = express.Router();

const path = require('path');
var buildPath = __dirname + '/../../build/';

Router.route('*').get(function(req, res) {
    res.sendFile(path.join(buildPath, 'index.html'));
});

Router.route('*').post(function(req, res) {
    res.sendFile(path.join(buildPath, 'index.html'));
});

module.exports = Router;
