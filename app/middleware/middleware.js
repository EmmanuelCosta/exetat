var express    = require('express'); 
var router = express.Router();              // get an instance of the express Router
var bole = require('bole');
var log = bole('middleware');
var config = require('../config/config')

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging if needed
    
   // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://emmanuelcosta.github.io/');
    log.info("====> "+config.http);
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next(); // make sure we go to the next routes and don't stop here
});

module.exports = router