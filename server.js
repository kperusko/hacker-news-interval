'use strict';

var express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  helmet = require('helmet'),
  config = require('./config'),
  mongoose = require('mongoose');

mongoose.connect(config.db);

var app = express();

// Enable compresssion 
app.use(compression());

// Enable request logging
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Prevent clickjacking
app.use(helmet.xframe());
// Basic XSS protection
app.use(helmet.xssFilter());
// Keep clients from sniffing the MIME type
app.use(helmet.nosniff());
// Restrict IE from executing downloads
app.use(helmet.ienoopen());
// Skip middleware to disable X-Powered-By header
app.disable('x-powered-by');

var apiRoutes = require('./routes/api')(express);
app.use('/api', apiRoutes);

// connection errors
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

// 404 - catch and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 500 - development error handler; print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    console.log(req.body);
    console.log(err);
    res.status(err.status || 500).send({
      message: err.message,
      error: err
    });
  });
}

// 500 - production error handler; no stacktrace
app.use(function (err, req, res, next) {
  res.status(err.status || 500).send({
    message: err.message,
    error: {}
  });
});

app.listen(config.http.port);
console.log('Listening on port ' + config.http.port);
