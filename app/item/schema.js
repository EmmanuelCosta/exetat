var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var itemSchema   = new Schema({
   serie:{type:String, required:true,uppercase: true, trim: true},
   year:{type:Number, required:true},
   subject:[Schema.ObjectId],
   question:[Schema.ObjectId]
   
});

itemSchema.index({serie:1,year:1,subject:1},{unique:true});

module.exports=itemSchema;