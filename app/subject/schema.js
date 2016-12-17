var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var subjectSchema = new Schema({
  name:{type: String, required:true,lowercase: true, trim: true},
  section:[Schema.ObjectId],
  item:[{
        id:Schema.ObjectId,
        serie:{type: String, required:true},
        year:{type:Number,required:true}
      }]
});

module.exports=subjectSchema;