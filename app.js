var express = require('express'),
    app = express(),
    assert = require('assert'),
    MongoClient = require('mongodb').MongoClient;

const URL = 'mongodb://localhost:27017/bookshelf'

MongoClient.connect(URL, function(err, db) {

  assert.equal(null, err);
  console.log("Successfully connected to MongoDB.");

  app.get('/', function(req, res){
    db.collection('books').find({}).toArray(function(err, docs) {
      res.setHeader('Content-type', 'application/json');
      res.send(docs);
    });
  });

  app.post('/new', function(req, res, next) {
    var title = req.body.title;
    var description = req.body.description;

    if (title == '' || description == '') {
      console.log("all fields must be filled");
      res.redirect('/');
    } else {
      db.collection('books').insertOne(
        { 'title': title, 'description': description },
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