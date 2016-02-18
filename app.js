var express = require('express'),
    app = express(),
    assert = require('assert'),
    MongoClient = require('mongodb').MongoClient;


MongoClient.connect('mongodb://localhost:27017/bookshelf', function(err, db) {

  assert.equal(null, err);
  console.log("Successfully connected to MongoDB.");

  app.get('/', function(req, res){
    db.collection('books').find({}).toArray(function(err, docs) {
      res.setHeader('Content-type', 'application/json');
      res.send(docs);
    });
  });

  app.use(function(req, res){
    res.sendStatus(404);
  });

  var server = app.listen(3000, function() {
      var port = server.address().port;
      console.log('Express server listening on port %s.', port);
  });

});