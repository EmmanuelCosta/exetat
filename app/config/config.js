var config = module.exports
var PRODUCTION = process.env.NODE_ENV === 'production'
var DEVELOPMENT = process.env.NODE_ENV === 'developpent'|true

if(PRODUCTION){
//TODO
// config.db same deal
// config.email etc
// config.log
}else if (DEVELOPMENT) {
//ds133338.mlab.com:33338/heroku_6j3rpf1c -u <dbuser> -p <dbpassword>

//mongodb://<dbuser>:<dbpassword>@ds133338.mlab.com:33338/heroku_6j3rpf1c

  config.express = {
  port: process.env.EXPRESS_PORT || 3300,
  ip: process.env.EXPRESS_HOST || '127.0.0.1'
  }

  config.mongodb = {
    port: process.env.MONGODB_PORT || 27017,
    host: process.env.MONGODB_HOST || 'localhost'
  }
  config.http=process.env.HTTP_HOST || 'http://localhost:3000'
  config.db=process.env.MONGODB_URI || 'mongodb://localhost/exetat'

}
