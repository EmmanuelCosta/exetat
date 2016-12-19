var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var itemSchema   = new Schema({
   serie:{type:String, required:true,uppercase: true, trim: true},
   year:{type:Number, required:true},
   subject:[Schema.ObjectId],
   question:[{
              id:{type:Schema.ObjectId,required:true},
              index:{type :Number, required: true,min:1, max:2},
              libelle:{type:String, required:true},
              answer:[{
                id:{type:Schema.ObjectId,required:true},
                libelle:{type :String, required: true}
              }]
   }]
});

itemSchema.index({serie:1,year:1,subject:1},{unique:true});

module.exports=itemSchema;