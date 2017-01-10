var express = require('express');
var Question =require('./question');
var Item =require('../item/item');
var router = new express.Router();
var bole = require('bole');
var log = bole('question');
var common=require('../common/common');


router.get('/questions',function(req, res){
      Question.find(function(err, questions) {
            if (err){
               res.status(400);
               log.debug("[GET]["+req.originalUrl+"]"+"unexepected error while searching by all questions. error is : "+err) ;
               res.json({ message: 'unexpected error' });
            }else{
            res.json(questions);
          }
        });
});



//get one question by id
router.get('/question/:question_id',function(req, res) {
     
        Question.findById(req.params.question_id, function(err, question) {
            if (err){
               res.status(400);
                 log.debug("[GET]["+req.originalUrl+"]"+"unexepected error while searching by id. error is : "+err) ;
               res.json({ message: 'unexpected error' });
            }else{
               res.json(question);
          }
        });
});



router.get('/question/getNextIndex/:item_id',function(req, res) {
      Question.find({item: req.params.item_id},'index', function(err, questions) {
            if (err){
               res.status(400);
                 log.debug("[GET]["+req.originalUrl+"]"+"unexepected error while searching by id. error is : "+err) ;
               res.json({ message: 'unexpected error' });
            }else{               
                    res.json({"next":questions.length+1}); 
            }
        });
        
});

// create an question 
router.post('/question',function(req, res) {
        try{
          if(common.isEmpty(req.body.question)){
            res.status(400) 
            log.info("[POST]["+req.originalUrl+"]"+"the key question to parse is missing. The given url ="+req.body.question) ;
            res.json({ message: 'error with the urlencoded' });
             return;
          }
          var jsonQuestion = req.body.question;
          var indexRegex = new RegExp("\\d+");
          var statusRegex= new RegExp("true|false");

          jsonQuestion= JSON.parse(jsonQuestion);
           if(common.isEmpty(jsonQuestion.index) ){
            res.status(400) 
            log.info("[POST]["+req.originalUrl+"]"+"the index of question to parse is missing. The given url ="+req.body.question) ;
            res.json({ message: 'error with the urlencoded: index of question to parse is missing' });
            return;
          }else if(!(indexRegex.test(jsonQuestion.index))){
            res.status(400) 
            log.info("[POST]["+req.originalUrl+"]"+"index must have a number"+req.body.question) ;
            res.json({ message: 'error with the urlencoded: index of question must be a number'});
            return;
          }
          if(common.isEmpty(jsonQuestion.libelle) ){
            res.status(400) 
            log.info("[POST]["+req.originalUrl+"]"+"the libelle of question to parse is missing. The given url ="+req.body.question) ;
            res.json({ message: 'error with the urlencoded: libelle of question to parse is missing' });
            return;
          }

          if(common.isEmpty(jsonQuestion.item) ){
            res.status(400) 
            log.info("[POST]["+req.originalUrl+"]"+"the item of question to parse is missing. The given url ="+req.body.question) ;
            res.json({ message: 'error with the urlencoded: item of question to parse is missing' });
            return;
          }

          if(common.isEmpty(jsonQuestion.answer) ){
            res.status(400) 
            log.info("[POST]["+req.originalUrl+"]"+"the answer of question to parse is missing. The given url ="+req.body.question) ;
            res.json({ message: 'error with the urlencoded: answer of question to parse is missing' });
            return;
          }
                            
         if(!common.isAnArray(jsonQuestion.answer)){
            res.status(400) 
             log.info("[POST]["+req.originalUrl+"]"+"answer must be an array . url ="+req.body.question) ;
            res.json({ message: 'error with the urlencoded : answer must be an array' });
            return;
          }
           log.info("====>") ;
          if(common.isEmpty(jsonQuestion.imgPath)){
            jsonQuestion.imgPath="";
          }

           var question = new Question();
          question.index = jsonQuestion.index;
          question.libelle = jsonQuestion.libelle;
          question.imgPath=jsonQuestion.imgPath;
          question.item.push(jsonQuestion.item);
          for(var answer of jsonQuestion.answer){
            log.info("==> "+answer.libelle+" ==>"+answer.status)
            if(common.isEmpty(answer.libelle) || common.isEmpty(answer.status) || !(statusRegex.test(answer.status))){
              res.status(400) 
             log.info("[POST]["+req.originalUrl+"]--"+common.isEmpty(answer.libelle)+"--"
              +common.isEmpty(answer.status)+"--"+(statusRegex.test(answer.status))+"--please check the format of the answer . url ="+req.body.question) ;
            res.json({ message: 'json answer is not correct. check the correct format.' });
              return;
            }else{
              question.answer.push(answer);
            }
          }
          var query = Item.findById(jsonQuestion.item);
           query.exec(function(err,item){
            if(err){
              res.status(400);
              log.info("error while searching the item");         
              res.json({message:"something went wrong while requesting the database"});
              return;
            }else if(common.isEmpty(item)){
              res.status(400);
              log.info("No item found with the given id");         
              res.json({message:"No item found with the giBen id"});
              return;
            }else{

               question.save(function(err) {      
                      if (err){                 
                        log.info("[PUT]["+req.originalUrl+"]"+"unexepected error while saving by id. error is : "+err) ;
                        
                      }
                      item.question.push(question._id);
                      item.save(function(err) {      
                        if (err){                 
                          log.info("[PUT]["+req.originalUrl+"]"+"unexepected error while saving by id. error is : "+err) ;
                          
                        }
                      });
                    });
              res.json({message:"Action posted"})
            }
           });                   
    
    }catch(e){
         res.json({ message: 'the given url object must be a well formatted json' });
         log.info(e);
      }
       
});

module.exports = router