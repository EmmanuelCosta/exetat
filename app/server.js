//#!/usr/bin/env node

var app = require('./index')
var config = require('./config/config')
var db = require('./config/db')
var bodyParser = require('body-parser');
const fs = require('fs');

// Use whichever logging system you prefer.
var bole = require('bole')

bole.output([
  { level: 'debug', stream: fs.createWriteStream('./app/log/app.log') },
  { level: 'info', stream: process.stdout }
])
var log = bole('server')

log.info('server process starting')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Note that there's not much logic in this file.
// The server should be mostly "glue" code to set things up and
// then start listening
app.listen(config.express.port, config.express.ip, function (error) {
  if (error) {
    log.error('Unable to listen for connections', error)
    process.exit(10)
  }
  log.info('express is listening on http://' +
    config.express.ip + ':' + config.express.port)
})