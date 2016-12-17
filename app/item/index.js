var express = require('express');
var Item =require('./item');
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

// get the item by id id (accessed at POST http://localhost:3000/api/item/)
router.post('/item',function(req, res) {
        
          if(common.isEmpty(req.body.item)){
            res.status(400) 
            log.debug("[POST]["+req.originalUrl+"]"+"the key item to parse is missing. The given is req.body.item ="+req.body.item) ;
             res.json({ message: 'error with the urlencoded' });
             return;
          }
          var jsonItem = req.body.item;
          jsonItem= JSON.parse(jsonItem);
           if(common.isEmpty(jsonItem.name) ){
            log.debug("[POST]["+req.originalUrl+"]"+"the name  o of item to parse is missing. The given is req.body.item ="+req.body.item) ;
            res.json({ message: 'error with the urlencoded' });
            return;
          }
                   
          var item = new Item();
          item.name = jsonItem.name;  
          if(!common.isAnArray(jsonItem.section)){
             item.item =jsonItem.section
         
          }
         t;      
          item.save(function(err) {         
              if (err){
                   log.debug("[POST]["+req.originalUrl+"]"+"unexepected error while saving. error is : "+err) ;
                 res.json({ message: 'unexpected error' });
              }else{
              res.json({ message: 'Item created!' });
            }
          });
       
});

// add the question  (accessed at PUT http://localhost:3000/api/item)
router.put('/item/changeName',function(req, res) {                 

          if(common.isEmpty(req.body.item)){
            res.status(400) 
            log.debug("[PUT]["+req.originalUrl+"]"+"the key item to parse is missing. The given is req.body.item ="+req.body.item) ;
             res.json({ message: 'error with the urlencoded' });
             return;
          }
            var jsonItem = req.body.item;
            jsonItem= JSON.parse(jsonItem);
          if(common.isEmpty(jsonItem._id)||common.isEmpty(jsonItem.name)){
              res.status(400)  
            log.debug("[PUT]["+req.originalUrl+"]"+"the _id of item or the name to parse is missing. The given is req.body.item ="+req.body.item) ;
             res.json({ message: 'error with the urlencoded' });
             return;
          }else{

          Item.findById(jsonItem._id, function(err, item) {
            if (err){
             
                 log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while searching by id. error is : "+err) ;
               res.json({ message: 'unexpected error' });
            }else{ 
               item.name=jsonItem.name;
               
                item.save(function(err) {         
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
router.put('/item/addSection',function(req, res) {                 
        try{
          if(common.isEmpty(req.body.item)){
            res.status(400) 
            log.debug("[PUT]["+req.originalUrl+"]"+"the key item to parse is missing. The given is req.body.item ="+req.body.item) ;
             res.json({ message: 'error with the urlencoded' });
             return;
          }
            var jsonItem = req.body.item;
            jsonItem= JSON.parse(jsonItem);
          if(common.isEmpty(jsonItem._id)||common.isEmpty(jsonItem.section)){
              res.status(400)  
            log.debug("[PUT]["+req.originalUrl+"]"+"the _id of item or the section to parse is missing. The given is req.body.item ="+req.body.item) ;
             res.json({ message: 'error with the urlencoded' });
             return;
          }else{

           Item.findById(jsonItem._id, function(err, item) {
            if (err){
             res.status(400);
                 log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while searching by id. error is : "+err) ;
               res.json({ message: 'the id of the item is not right' });
               return;
            }else{ 
               log.info("jsonSection = "+jsonItem.section);
              for (var sectionId of jsonItem.section){
                  var itemInSection = {id:item._id,name:item.name};
                     log.info("sectionId = "+sectionId);
                   Section.findByIdAndUpdate(sectionId,{$push: {item:itemInSection}}, function(err) {
                      if(err){
                        log.info("[PUT]["+req.originalUrl+"]"+"can not find the section with id " +sectionId+ " can not update section. error is : "+err) ;
                      }else{
                        item.section.push(sectionId);
                      }
                   });
              }
                if(!common.isEmpty(item.section)){
                  item.save(function(err) {      
                      if (err){                 
                      log.debug("[PUT]["+req.originalUrl+"]"+"unexepected error while saving by id. error is : "+err) ;
                     res.json({ message: 'unexpected error' });
                      }else{                    
                      res.json({ message: 'Section save in item !'});
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