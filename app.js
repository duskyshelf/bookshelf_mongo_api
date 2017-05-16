const assert = require('assert');
const bodyParser = require('body-parser');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();

const URL = 'mongodb://localhost:27017/default'

MongoClient.connect(URL, (err, db) => {

  assert.equal(null, err);
  console.log("Successfully connected to MongoDB.");

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json());

  app.get('/', (req, res) => {
    db.collection('posts').find({}).toArray((err, docs) => {
      res.setHeader('Content-type', 'application/json');
      res.send({ posts: docs });
    });
  });

  app.get('/id/:id', (req, res) => {
    const id = req.params.id;

    db.collection('posts').find({ id: id }).toArray((err, docs) => {
      res.setHeader('Content-type', 'application/json');
      res.send(docs);
    });
  });

  app.post('/new', (req, res, next) => {
    const id = req.body.id;
    const content = req.body.content;

    if (id == '' || content == '') {
      console.log("all fields must be filled");
      res.redirect('/');
    } else {
      db.collection('posts').insertOne(
        { 'id': id, 'content': content },
        (err, r) => {
          assert.equal(null, err);
          res.redirect('/');
        }
      );
    }
  });

  app.post('/update', function(req, res, next) {
    const id = req.body.id;
    const content = req.body.content;

    if (id == '' || content == '') {
      console.log("all fields must be filled");
      res.redirect('/');
    } else {
      db.collection('posts')
        .findAndModify(
          { 'id': id }, // query
          [[ '_id' , 'asc' ]], // sort order
          { $set: { content: content }}, // replace content
          {}, // options
          (err, r) => {
            assert.equal(null, err);
            res.redirect('/');
          }
        );
    }
  });

  app.use((req, res) => {
    res.sendStatus(404);
  });

  const server = app.listen(3000, () => {
      const port = server.address().port;
      console.log('Express server listening on port %s.', port);
  });

});