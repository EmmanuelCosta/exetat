var express = require('express');
var Question =require('./question');
var router = new express.Router();
var bole = require('bole');
var log = bole('question');
/*
var newQuestion = new Question({
  index:0,
    libelle:"ceci est un test",
    answer:[{
     libelle:"vrai",
      status: true
    }]
});

newQuestion.save(function(err) {
  if (err) throw err;
  log.debug('Question has been created');
});
*/

//get all questions
router.get('/questions',function(req, res){
      Question.find(function(err, questions) {
            if (err)
                res.send(err);

            res.json(questions);
        });
});


// get the question with that id (accessed at GET http://localhost:8080/api/question/:id)
router.get('/question/:question_id',function(req, res) {
      log.debug(req.params.question_id +' Question has been created');
        Question.findById(req.params.question_id, function(err, question) {
            if (err)
                res.send(err);
            res.json(question);
        });
});

// get the question with that id (accessed at POST http://localhost:8080/api/question/:id)
router.post('/question',function(req, res) {
 
        var id = req.body.id;
        Question.findById(id, function(err, question) {
            if (err)
                res.send(err);
            res.json(question);
        });
});

// add the question  (accessed at PUT http://localhost:8080/api/question/:id)
router.put('/question',function(req, res) {
 
        var jsonQuestion = req.body.question;

        res.json(jsonQuestion);
});



module.exports = router