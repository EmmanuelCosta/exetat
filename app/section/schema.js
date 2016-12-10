var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var sectionSchema = new Schema({
  name:{type: String, required:true},
  subject:[
    {
        id:Schema.ObjectId,
        name:{type: String, required:true}
      }
    ]
});

module.exports=sectionSchema;