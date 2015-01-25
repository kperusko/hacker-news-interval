'use strict';

var express = require('express'),
  path = require('path'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  helmet = require('helmet'),
  consolidate = require('consolidate'),
  mongoose = require('mongoose'),
  config = require('./config/config');

// MongoDB connection ---------------------------------------------------------
mongoose.connect(config.db.uri, config.db.options);

mongoose.connection.on('connected', function () {
  console.log('Connected to MongoDB');
});

// Log connection errors
mongoose.connection.on('error', console.error.bind(console,
  'MongoDB connection error:'));

var app = express();

// Configuration --------------------------------------------------------------
// Enable compresssion 
app.use(compression());

// Enable short colored output for development
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan(config.log.format, {
    stream: __dirname + '/../morgan.log'
  }));
}

// Set swig as the template engine
app.engine('html', consolidate.swig);
// Set views path and view engine
app.set('view engine', 'html');
app.set('views', './app/views');

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

// Routes ----------------------------------------------------------------------
// Setting the app router and static folder
app.use(express.static(path.resolve('./public')));

app.get('/', function (req, res) {
  res.render('index', {});
});

var apiRoutes = require('./app/routes/api')(express);
app.use('/api', apiRoutes);

// Error handlers --------------------------------------------------------------
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
    message: err.message
  });
});

// Start server ----------------------------------------------------------------
var server = app.listen(config.port);

server.on('listening', function () {
  console.log('Listening on port ' + server.address().port);
});

server.on('error', function (error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var port = 'Port ' + config.port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    console.error(port + ' requires elevated privileges');
    process.exit(1);
    break;
  case 'EADDRINUSE':
    console.error(port + ' is already in use');
    process.exit(1);
    break;
  default:
    throw error;
  }
});
