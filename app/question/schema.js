var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var questionSchema   = new Schema({
    index:{type :Number, required: true},
    libelle:{type :String, required: true},
    item:[Schema.ObjectId],
    imgPath:{type :String},
    answer:[
      {       
       libelle:{type :String, required: true},
       status: {type :Boolean, required: true}
      }
    ]
});

module.exports=questionSchema;