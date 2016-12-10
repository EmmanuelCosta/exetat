var mongoose     = require('mongoose');
var questionSchema  = require('./schema');


var Question = mongoose.model('Question', questionSchema,'question' );

module.exports =Question;