const assert = require('assert');
const bodyParser = require('body-parser');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();

const URL = 'mongodb://localhost:27017/default'

MongoClient.connect(URL, function(err, db) {

  assert.equal(null, err);
  console.log("Successfully connected to MongoDB.");

  app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
  app.use(bodyParser.json()); // parse application/json

  app.get('/', function(req, res){
    db.collection('posts').find({}).toArray(function(err, docs) {
      res.setHeader('Content-type', 'application/json');
      res.send({ posts: docs });
    });
  });

  app.get('/id/:id', function(req, res){
    const id = req.params.id;

    db.collection('posts').find({ id: id }).toArray(function(err, docs) {
      res.setHeader('Content-type', 'application/json');
      res.send(docs);
    });
  });

  app.post('/new', function(req, res, next) {
    const id = req.body.id;
    const content = req.body.content;

    if (id == '' || content == '') {
      console.log("all fields must be filled");
      res.redirect('/');
    } else {
      db.collection('posts').insertOne(
        { 'id': id, 'content': content },
        function (err, r) {
          assert.equal(null, err);
          res.redirect('/');
        }
      );
    }
  });

  app.use(function(req, res) {
    res.sendStatus(404);
  });

  var server = app.listen(3000, function() {
      var port = server.address().port;
      console.log('Express server listening on port %s.', port);
  });

});