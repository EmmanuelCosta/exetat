var express = require('express')
var bodyParser = require('body-parser');
var app = express()
var router = new express.Router()


app.set('views', __dirname)
// use whatever templating system(s) you like
app.set('view engine', 'jade')
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//middleware 
app.use( require('./middleware/middleware'))
// See the README about ordering of middleware
// Load the routes ("controllers" -ish)
app.use(
  router.get('/', function(req, res) {
    res.json({ message: 'exetat! bienvenu!' });   
  })
);
app.use(require('./question/index'));
app.use(require('./section/index'));


// FINALLY, use any error handlers
//app.use(require('./errors/not-found'));



// Export the app instance for unit testing via supertest
module.exports = app