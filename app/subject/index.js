var express = require('express');
var Subject =require('./subject');
var Section =require('../section/section');
var router = new express.Router();
var bole = require('bole');
var log = bole('subject');
var assert = require('assert');
var common=require('../common/common');

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

// get the subject by id id (accessed at POST http://localhost:3000/api/subject/)
router.post('/subject',function(req, res) {
        
          if(common.isEmpty(req.body.subject)){
            res.status(400) 
            log.debug("[POST]["+req.originalUrl+"]"+"the key subject to parse is missing. The given is req.body.subject ="+req.body.subject) ;
             res.json({ message: 'error with the urlencoded' });
             return;
          }
          var jsonSubject = req.body.subject;
          jsonSubject= JSON.parse(jsonSubject);
           if(common.isEmpty(jsonSubject.name) ){
            log.debug("[POST]["+req.originalUrl+"]"+"the name  o of subject to parse is missing. The given is req.body.subject ="+req.body.subject) ;
            res.json({ message: 'error with the urlencoded' });
            return;
          }
                   
          var subject = new Subject();
          subject.name = jsonSubject.name;  
          if(!common.isAnArray(jsonSubject.section)){
             subject.subject =jsonSubject.section
         
          }
         t;      
          subject.save(function(err) {         
              if (err){
                   log.debug("[POST]["+req.originalUrl+"]"+"unexepected error while saving. error is : "+err) ;
                 res.json({ message: 'unexpected error' });
              }else{
              res.json({ message: 'Subject created!' });
            }
          });
       
});

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
            if (err){
             res.status(400);
                 log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while searching by id. error is : "+err) ;
               res.json({ message: 'the id of the subject is not right' });
               return;
            }else{ 
               log.info("jsonSection = "+jsonSubject.section);
              for (var sectionId of jsonSubject.section){
                  var subjectInSection = {id:subject._id,name:subject.name};
                     log.info("sectionId = "+sectionId);
                   Section.findByIdAndUpdate(sectionId,{$push: {subject:subjectInSection}}, function(err) {
                      if(err){
                        log.info("[PUT]["+req.originalUrl+"]"+"can not find the section with id " +sectionId+ " can not update section. error is : "+err) ;
                      }else{
                        subject.section.push(sectionId);
                      }
                   });
              }
                if(!common.isEmpty(subject.section)){
                  subject.save(function(err) {      
                      if (err){                 
                      log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while saving by id. error is : "+err) ;
                     res.json({ message: 'unexpected error' });
                      }else{                    
                      res.json({ message: 'Section save in subject !'});
                      }
                  });
              }
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