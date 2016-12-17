var mongoose = require('mongoose');
var Schema= mongoose.Schema;
var bole = require('bole');
var log = bole('ss');

var sectionSchema = new Schema({
  name:{type: String, required:true,lowercase: true, trim: true, index:true,unique:true},
  subject:[
    {
        id:Schema.ObjectId,
        name:{type: String, required:true,lowercase: true, trim: true}
      }
    ]
});


module.exports=sectionSchema;