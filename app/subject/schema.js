var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var subjectSchema = new Schema({
  name:{type: String, require:true},
  item:{
      [
        id:ObjectId,
        serie:{type: String, require:true},
        year:{type:Number,require:true}
      ]
    }
});

module.exports=subjectSchema;