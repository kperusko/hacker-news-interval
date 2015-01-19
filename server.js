'use strict';

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config');
var mongoose = require('mongoose');

mongoose.connect(config.db);

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

// handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
	next();
});

var apiRoutes = require('./routes/api')(app, express);
app.use('/api', apiRoutes);

app.listen(config.http.port);
console.log('Listening on port ' + config.http.port);
