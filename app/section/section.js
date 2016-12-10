var mongoose     = require('mongoose');
var sectionSchema  = require('./schema');


var Section = mongoose.model('Section', sectionSchema,'section');


module.exports =Section;