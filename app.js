var express = require('express'),
    app = express(),
    MongoClient = require('mongodb').MongoClient;


MongoClient.connect('mongodb://localhost:27017/[DBNAME]', function(err, db) {

  assert.equal(null, err);
  console.log("Successfully connected to MongoDB.");

  app.get('/', function(req, res){
    db.collection('books').find({}).toArray(function(err, docs) {
      res.setHeader('Content-type', 'application/json');
      res.send(docs);
    });
  });

});