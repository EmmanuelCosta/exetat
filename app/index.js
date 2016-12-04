var express = require('express')

var app = express()
var router = new express.Router()


app.set('views', __dirname)
// use whatever templating system(s) you like
app.set('view engine', 'jade')

app.use( require('./middleware/middleware'))
// See the README about ordering of middleware
// Load the routes ("controllers" -ish)
app.use(
  router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
  })
);
app.use(require('./question/index'))


// FINALLY, use any error handlers
app.use(require('./errors/not-found'))



// Export the app instance for unit testing via supertest
module.exports = app