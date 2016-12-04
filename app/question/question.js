var mongoose     = require('mongoose');
var questionSchema  = require('./schema');
var mongoose     = require('mongoose');

var Question = mongoose.model('Question', questionSchema,'question' );

module.exports =Question;