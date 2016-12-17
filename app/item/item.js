var mongoose     = require('mongoose');
var itemSchema  = require('./schema');
var mongoose     = require('mongoose');

var Item = mongoose.model('Item', itemSchema,'item' );



module.exports =Item;