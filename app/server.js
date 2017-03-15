//#!/usr/bin/env node

var app = require('./index')
var config = require('./config/config')
var db = require('./config/db')
const fs = require('fs');
var mongoose     = require('mongoose');
mongoose.Promise = require('bluebird');

// Use whichever logging system you prefer.
var bole = require('bole')

bole.output([
  { level: 'debug', stream: fs.createWriteStream('./app/log/app') },
  { level: 'info', stream: process.stdout }
])
var log = bole('server')

log.info('server process starting')

log(" config.http="+ config.http)

// Note that there's not much logic in this file.
// The server should be mostly "glue" code to set things up and
// then start listening
app.listen(config.express.port,  function (error) {
  if (error) {
    log.error('Unable to listen for connections', error)
    process.exit(10)
  }
  log.info('express is listening on http://' +
    config.express.ip + ':' + config.express.port)
})

