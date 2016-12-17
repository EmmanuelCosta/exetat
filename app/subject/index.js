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
           for (var sectionId of jsonSubject.section){
              log.info(" === "+sectionId +" == "+subject.section);
              
                   var subjectInSection = {id:subject._id,name:subject.name};
                   Section.findByIdAndUpdate(sectionId,{$push: {subject:subjectInSection}}, function(err,findSection) {
                      if(err ||common.isEmpty(findSection) ){
                        result.error.push({'message':'section with id : '+sectionId+' not found in the database. So no update is perform on it'});
                        log.info("[PUT]["+req.originalUrl+"]"+"can not find the section with id " +sectionId+ " can not update section. error is : "+err) ;
                      }else{

                        result.success.push({'message':'section with id : '+sectionId+' update'});
                        subject.section.push(sectionId);
                        subject.save(function(err) {      
                        if (err){                 
                          log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while saving by id. error is : "+err) ;
                          result.success.push({'message':'subject not created for section with id : '+sectionId});
                         
                        }else{
                            result.success.push({'message':'subject created for section with id : '+sectionId});
                        }
                  });

                      }
                   });
               
                   
              }
              res.json({ message: 'action perform' });
          
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
            if (err){
             res.status(400);
                 log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while searching by id. error is : "+err) ;
               res.json({ message: 'the id of the subject is not right' });
               return;
            }else{ 
               log.info("jsonSection = "+jsonSubject.section);

              for (var sectionId of jsonSubject.section){
              log.info(" ===> "+(ObjectID(sectionId)) +" === "+sectionId +" == "+subject.section);
               if(!(new ObjectID(sectionId) in subject.section)){
                   var subjectInSection = {id:subject._id,name:subject.name};
                   Section.findByIdAndUpdate(sectionId,{$push: {subject:subjectInSection}}, function(err) {
                      if(err){
                        log.info("[PUT]["+req.originalUrl+"]"+"can not find the section with id " +sectionId+ " can not update section. error is : "+err) ;
                      }else{
                        subject.section.push(sectionId);
                        subject.save(function(err) {      
                        if (err){                 
                          log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while saving by id. error is : "+err) ;
                         
                        }
                  });

                      }
                   });
               }else{
                 log.info("json ok ");
               }
                   
              }
                
                  
              
                  res.json({ message: 'Section save in subject !'});
              
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