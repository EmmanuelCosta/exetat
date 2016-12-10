var express = require('express');
var Subject =require('./subject');
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
           if(common.isEmpty(jsonSubject.name) || common.isEmpty(jsonSubject.section)){
            log.debug("[POST]["+req.originalUrl+"]"+"the name  or the section of subject to parse is missing. The given is req.body.subject ="+req.body.subject) ;
            res.json({ message: 'error with the urlencoded' });
            return;
          }
          if(!common.isAnArray(jsonSubject.section)){
            log.debug("[POST]["+req.originalUrl+"]"+"the section of subject must be an array. The given is req.body.subject ="+req.body.subject) ;
            res.json({ message: 'error with the urlencoded' });
            return ;
          }
     
          
          var subject = new Subject();
          subject.name = jsonSubject.name;  
          subject.section =jsonSubject.section;      
          subject.save(function(err) {         
              if (err){
                   log.debug("[POST]["+req.originalUrl+"]"+"unexepected error while saving. error is : "+err) ;
                 res.json({ message: 'unexpected error' });
              }else{
              res.json({ message: 'Subject created!' });
            }
          });
       
});

module.exports = router