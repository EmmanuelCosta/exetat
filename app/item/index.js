var express = require('express');
var Item =require('./item');
var Subject=require('../subject/subject');
var router = new express.Router();
var bole = require('bole');
var log = bole('item');
var assert = require('assert');
var common=require('../common/common');

// get all items
router.get('/items',function(req, res){
      Item.find(function(err, items) {
            if (err){
               log.debug("[GET]["+req.originalUrl+"]"+"unexepected error while searching by all items. error is : "+err) ;
               res.json({ message: 'unexpected error' });
            }else{
            res.json(items);
          }
        });
});

//get one item by id
router.get('/item/:item_id',function(req, res) {
     
        Item.findById(req.params.item_id, function(err, item) {
            if (err){
                 log.debug("[GET]["+req.originalUrl+"]"+"unexepected error while searching by id. error is : "+err) ;
               res.json({ message: 'unexpected error' });
            }else{
               res.json(item);
          }
        });
});


// create an item 
router.post('/item',function(req, res) {
        try{
          if(common.isEmpty(req.body.item)){
            res.status(400) 
            log.info("[POST]["+req.originalUrl+"]"+"the key item to parse is missing. The given url ="+req.body.item) ;
            res.json({ message: 'error with the urlencoded' });
             return;
          }
          var jsonItem = req.body.item;
          var serieRegex = new RegExp("[A-D]{1}");
          var yearRegex= new RegExp("^(19|20)\\d{2}$");

          jsonItem= JSON.parse(jsonItem);
           if(common.isEmpty(jsonItem.serie) ){
            res.status(400) 
            log.info("[POST]["+req.originalUrl+"]"+"the serie of item to parse is missing. The given url ="+req.body.item) ;
            res.json({ message: 'error with the urlencoded: serie of item to parse is missing' });
            return;
          }else if(jsonItem.serie.length !=1 || !(serieRegex.test(jsonItem.serie.toUpperCase()))){
            res.status(400) 
            log.info("[POST]["+req.originalUrl+"]"+"serie must have one letter"+req.body.item) ;
            res.json({ message: 'error with the urlencoded: serie of item must be one letter in [A-D]'});
            return;
          }
          if(common.isEmpty(jsonItem.year) ){
            res.status(400) 
            log.info("[POST]["+req.originalUrl+"]"+"the year of item to parse is missing. The given url ="+req.body.item) ;
            res.json({ message: 'error with the urlencoded: year of item to parse is missing' });
            return;
          }else if(jsonItem.year.length !=4 || !(yearRegex.test(jsonItem.year))) {
            res.status(400) 
            log.info("[POST]["+req.originalUrl+"]"+"the year of item to parse is not correct. The given url ="+req.body.item) ;
            res.json({ message: 'error with the urlencoded: year of item to parse is not correct' });
            return;
          }
          if(common.isEmpty(jsonItem.subject) ){
            res.status(400) 
            log.info("[POST]["+req.originalUrl+"]"+"the subject of item to parse is missing. The given url ="+req.body.item) ;
            res.json({ message: 'error with the urlencoded: subject of item to parse is missing' });
            return;
          }
                            
         if(!common.isAnArray(jsonItem.subject)){
            res.status(400) 
             log.info("[POST]["+req.originalUrl+"]"+"subject must be an array . url ="+req.body.item) ;
            res.json({ message: 'error with the urlencoded : subject must be an array' });
            return;
          }

           var item = new Item();
          item.serie = jsonItem.serie;
          item.year = jsonItem.year;
                  
          var result={success:[],
                      error:[]};
             
           
            var query = Subject.find({_id:{$in:jsonItem.subject}});
           query.exec(function(err,subjects){
            if(err){
                  res.status(400);
                  result.error.push("something went wrong while requesting the database");
                   res.json({message:"Operation completed with error on database"});
            }else if(common.isEmpty(subjects)){
              res.status(400);
                  log.info("No subject found with the given id");
                  result.error.push("No subject found with the given id");
                   res.json({message:"no subject found"});
            }else{
               var itemInSubject = {id:item._id,serie:item.serie,year:item.year};
                for(var subject of subjects){
                    subject.item.push(itemInSubject);
                    item.subject.push(subject._id);
                    subject.save(function(err) {      
                      if (err){   
                        res.status(400);              
                        log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while saving by id. error is : "+err) ;
                        
                      }
                    });
                }

                item.save(function(err) {      
                  if (err){   
                  res.status(400);              
                    log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while saving by id. error is : "+err);                   
                  }
                });
                res.json({message:"Operation completed"});
            }
           });                  
    
          
      }catch(e){
         res.json({ message: 'the given url object must be a well formatted json' });
         log.debug(e);
      }
       
});

module.exports = router