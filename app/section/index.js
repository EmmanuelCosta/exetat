var express = require('express');
var Section =require('./section');
var router = new express.Router();
var bole = require('bole');
var log = bole('section');
var assert = require('assert');
var common=require('../common/common');

// get all sections
router.get('/sections',function(req, res){
      Section.find(function(err, sections) {
            if (err){
               log.debug("[GET]["+req.originalUrl+"]"+"unexepected error while searching by all sections. error is : "+err) ;
               res.json({ message: 'unexpected error' });
            }else{
               log.debug("[GET]["+req.originalUrl+"]"+"GET SECTION OK ") ;
            res.json(sections);
          }
        });
});


router.get('/section/:section_id',function(req, res) {
     
        Section.findById(req.params.section_id, function(err, section) {
            if (err){
                 log.debug("[GET]["+req.originalUrl+"]"+"unexepected error while searching by id. error is : "+err) ;
               res.json({ message: 'unexpected error' });
            }else{
            log.debug("[GET]["+req.originalUrl+"]"+"GET SECTION OK ") ;
            res.json(section);
          }
        });
});

// get the section by id id (accessed at POST http://localhost:3000/api/section/)
router.post('/section',function(req, res) {
        
          if(common.isEmpty(req.body.section)){
            res.status(400) ;
            log.info("[POST]["+req.originalUrl+"]"+" the key section to parse is missing. The given is req.body.section ="+req.body.section) ;
             res.json({ message: '[1] error with the urlencoded' });
             return;
          }
          var jsonSection = req.body.section;
          jsonSection= JSON.parse(jsonSection);
          if(!common.isEmpty(jsonSection.name)){
          
          
          var section = new Section();
          section.name = jsonSection.name;        
          section.save(function(err) {         
              if (err){
                   log.debug("[POST]["+req.originalUrl+"]"+"unexepected error while saving. error is : "+err) ;
                 res.json({ message: '[2] unexpected error' });
              }else{
              log.info("[POST]["+req.originalUrl+"]"+"POST SECTION SAVED ") ;
              res.json({ message: 'Section created!' });
            }
          });
        }else{
          log.info("[POST]["+req.originalUrl+"]"+"the name of section to parse is missing. The given is req.body.section ="+req.body.section) ;
          res.json({ message: '[3] error with the urlencoded' });
        }
});

// add the question  (accessed at PUT http://localhost:3000/api/section)
router.put('/section/changeName',function(req, res) {                 

          if(common.isEmpty(req.body.section)){
            res.status(400) 
            log.debug("[PUT]["+req.originalUrl+"]"+"the key section to parse is missing. The given is req.body.section ="+req.body.section) ;
             res.json({ message: '[1] error with the urlencoded' });
             return;
          }
            var jsonSection = req.body.section;
            jsonSection= JSON.parse(jsonSection);
          if(common.isEmpty(jsonSection._id)||common.isEmpty(jsonSection.name)){
              res.status(400)  
            log.debug("[PUT]["+req.originalUrl+"]"+"the _id of section or the name to parse is missing. The given is req.body.section ="+req.body.section) ;
             res.json({ message: '[2] error with the urlencoded' });
             return;
          }else{     

          Section.findById(jsonSection._id, function(err, section) {
            if (err){            
               log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while searching by id. error is : "+err) ;
               res.json({ message: '[3] unexpected error' });
            }else{ 
               section.name=jsonSection.name;
               
                section.save(function(err) {         
                    if (err){                 
                    log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while saving by id. error is : "+err) ;
                   res.json({ message: '[4] unexpected error' });
                    }else{
                      
                    res.json({ message: 'Section updated!'});
                  }
                });
            }
         });
        }
     
});


module.exports=router;