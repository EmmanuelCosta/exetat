var mongoose     = require('mongoose');
var subjectSchema  = require('./schema');
var mongoose     = require('mongoose');

var Subject = mongoose.model('Subject', subjectSchema,'subject' );

module.exports =Subject;