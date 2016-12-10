var express = require('express');
var Section =require('./section');
var router = new express.Router();
var bole = require('bole');
var log = bole('section');
var assert = require('assert');

// get all sections
router.get('/sections',function(req, res){
      Section.find(function(err, sections) {
            if (err){
              res.send(err);
            }else{
            res.json(sections);
          }
        });
});


router.get('/section/:section_id',function(req, res) {
      log.info(req.params.section_id +' Section has been created');
        Section.findById(req.params.section_id, function(err, section) {
            if (err){
                res.send(err);
            }else{
               res.json(section);
          }
        });
});

// get the section by id id (accessed at POST http://localhost:3000/api/section/:id)
router.post('/section',function(req, res) {
        
        var jsonSection = req.body.section;
        jsonSection= JSON.parse(jsonSection);
        var section = new Section();
        section.name = jsonSection.name;        
        section.save(function(err) {         
            if (err){
                res.send(err);
            }else{
            res.json({ message: 'Section created!' });
          }
        });
});

// add the question  (accessed at PUT http://localhost:3000/api/section)
router.put('/section',function(req, res) {        
          

          if(isEmpty(req.body.section)){
            res.status(400)  
             res.json({ message: 'missing section key' });
          }
            var jsonSection = req.body.section;
             jsonSection= JSON.parse(jsonSection);
          if(isEmpty(jsonSection._id)){
                res.status(400)  
             res.json({ message: 'missing id of the item' });
          }else{

        
         
           retreiveSection = Section.findById(jsonSection._id, function(err, section) {
            if (err){
                res.status(400)
                res.send(err);
            }
 
               section.name=jsonSection.name;
               
                section.save(function(err) {         
                    if (err){
                        res.send(err);
                    }else{
                      log.info("=======> "+section.subject[0]._id);
                    res.json({ message: 'Section updated!'});
                  }
                });
         });
        }
          

      
     
});

// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
module.exports=router;