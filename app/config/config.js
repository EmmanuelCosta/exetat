var config = module.exports
var PRODUCTION = process.env.NODE_ENV === 'production'
var DEVELOPMENT = process.env.NODE_ENV === 'developpent'|true

if (DEVELOPMENT) {

  config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  ip: '127.0.0.1'
  }

  config.mongodb = {
    port: process.env.MONGODB_PORT || 27017,
    host: process.env.MONGODB_HOST || 'localhost'
  }

  config.db='mongodb://localhost/exetat'

}else if (PRODUCTION) {
  // for example
  config.express.ip = '0.0.0.0'
}
// config.db same deal
// config.email etc
// config.log