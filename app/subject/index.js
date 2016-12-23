var express = require('express');
var Subject =require('./subject');
var Section =require('../section/section');
var router = new express.Router();
var bole = require('bole');
var log = bole('subject');
var assert = require('assert');
var common=require('../common/common');
var ObjectID = require('mongodb').ObjectID;


// get all subjects
router.get('/subjects',function(req, res){
      Subject.find(function(err, subjects) {
            if (err){
               log.debug("[GET]["+req.originalUrl+"]"+"unexepected error while searching by all subjects. error is : "+err) ;
               res.json({ message: 'unexpected error' });
            }else{
            res.json(subjects);
          }
        });
});


//get one subject by id
router.get('/subject/:subject_id',function(req, res) {
     
        Subject.findById(req.params.subject_id, function(err, subject) {
            if (err){
                 log.debug("[GET]["+req.originalUrl+"]"+"unexepected error while searching by id. error is : "+err) ;
               res.json({ message: 'unexpected error' });
            }else{
               res.json(subject);
          }
        });
});

// create a subject
router.post('/subject',function(req, res) {
        try{
          if(common.isEmpty(req.body.subject)){
            res.status(400) 
            log.info("[POST]["+req.originalUrl+"]"+"the key subject to parse is missing. The given url ="+req.body.subject) ;
             res.json({ message: 'error with the urlencoded' });
             return;
          }
          var jsonSubject = req.body.subject;
          jsonSubject= JSON.parse(jsonSubject);
           if(common.isEmpty(jsonSubject.name) ){
            res.status(400) 
            log.info("[POST]["+req.originalUrl+"]"+"the name of subject to parse is missing. The given url ="+req.body.subject) ;
            res.json({ message: 'error with the urlencoded: name of subject to parse is missing' });
            return;
          }
          if(common.isEmpty(jsonSubject.section)){
            res.status(400) 
            log.info("[POST]["+req.originalUrl+"]"+"the section of subject to parse is missing. The given url ="+req.body.subject) ;
            res.json({ message: 'error with the urlencoded : section of subject to parse is missing' });
            return;
          }
                   
         if(!common.isAnArray(jsonSubject.section)){
            res.status(400) 
             log.info("[POST]["+req.originalUrl+"]"+"section must be an array . url ="+req.body.subject) ;
            res.json({ message: 'error with the urlencoded : section must be an array' });
            return;
          }

           var subject = new Subject();
          subject.name = jsonSubject.name;
         
          var result={success:[],
                      error:[]};
             
           
            var query = Section.find({_id:{$in:jsonSubject.section}});
           query.exec(function(err,sections){
            if(err){
                  res.status(400);
                   log.info("database error");
                  res.json({message:"something went wrong while requesting the database"});
            }else if(common.isEmpty(sections)){
              res.status(400);
                  log.info("No section found with the given id");
                  res.json({message:"No section found with the given id"});
            }else{
               var subjectInSection = {id:subject._id,name:subject.name};
                for(var section of sections){
                    section.subject.push(subjectInSection);
                    subject.section.push(section._id);
                    section.save(function(err) {      
                      if (err){      
                      res.status(400);           
                        log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while saving by id. error is : "+err) ;
                        
                      }
                    });
                }

                subject.save(function(err) {      
                  if (err){   
                  res.status(400);              
                    log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while saving by id. error is : "+err);                   
                  }
                });
                   res.json({message:"operation posted"});
            }
           });

                   
    
          
      }catch(e){
         res.json({ message: 'the given url object must be a well formatted json' });
      }
       
});

/*
// add the question  (accessed at PUT http://localhost:3000/api/subject)
router.put('/subject/changeName',function(req, res) {                 

          if(common.isEmpty(req.body.subject)){
            res.status(400) 
            log.debug("[PUT]["+req.originalUrl+"]"+"the key subject to parse is missing. The given is req.body.subject ="+req.body.subject) ;
             res.json({ message: 'error with the urlencoded' });
             return;
          }
            var jsonSubject = req.body.subject;
            jsonSubject= JSON.parse(jsonSubject);
          if(common.isEmpty(jsonSubject._id)||common.isEmpty(jsonSubject.name)){
              res.status(400)  
            log.debug("[PUT]["+req.originalUrl+"]"+"the _id of subject or the name to parse is missing. The given is req.body.subject ="+req.body.subject) ;
             res.json({ message: 'error with the urlencoded' });
             return;
          }else{

          Subject.findById(jsonSubject._id, function(err, subject) {
            if (err){
             
                 log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while searching by id. error is : "+err) ;
               res.json({ message: 'unexpected error' });
            }else{ 
               subject.name=jsonSubject.name;
               
                subject.save(function(err) {         
                    if (err){                 
                    log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while saving by id. error is : "+err) ;
                   res.json({ message: 'unexpected error' });
                    }else{
                      
                    res.json({ message: 'Section updated!'});
                  }
                });
            }
         });
        }     
});
*/
// ajoute une section à une matière
router.put('/subject/addSection',function(req, res) {                 
        try{
          if(common.isEmpty(req.body.subject)){
            res.status(400) 
            log.debug("[PUT]["+req.originalUrl+"]"+"the key subject to parse is missing. The given is req.body.subject ="+req.body.subject) ;
             res.json({ message: 'error with the urlencoded' });
             return;
          }
            var jsonSubject = req.body.subject;
            jsonSubject= JSON.parse(jsonSubject);
          if(common.isEmpty(jsonSubject._id)||common.isEmpty(jsonSubject.section)){
              res.status(400)  
            log.debug("[PUT]["+req.originalUrl+"]"+"the _id of subject or the section to parse is missing. The given is req.body.subject ="+req.body.subject) ;
             res.json({ message: 'error with the urlencoded' });
             return;
          }else{

            
              Subject.findById(jsonSubject._id, function(err, subject) {
                  if (err || common.isEmpty(subject)){
                   res.status(400);
                       log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while searching by id. error is : "+err) ;
                     res.json({ message: 'the id of the subject is not right' });
                     return;
                  }else{ 
                   log.info("jsonSection = "+jsonSubject.section);

                   var query = Section.find({_id:{$in:jsonSubject.section}, 'subject.id':{$nin:jsonSubject._id}});
                   query.exec(function(err,sections){
                      if(err){
                           res.json(err);
                      }else if(!common.isEmpty(sections)){
                        var subjectInSection = {id:subject._id,name:subject.name};
                        var result={success:[],error:[]};
                          for(var section of sections){
                            section.subject.push(subjectInSection);
                            log.info("========");
                            //section.save
                            section.save(function(err) {      
                              if (err){  

                                log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while saving by id. error is : "+err) ;
                               
                              }
                            });
                            subject.section.push(section.id);
                            subject.save(function(err) {      
                              if (err){                 
                                log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while saving by id. error is : "+err) ;
                               
                              }
                            });
                           }
                            res.json({ message: "OK" });
                      }else{
                        res.json({ message: "No section with the provinding ..." });
                      }
                   });
                  } 
            });
        }
    }catch(e){

      res.status(400);
       log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error with the request"+e) ;
      res.json({ message: 'something went wrong check the given json'});

    }    
});

module.exports = router