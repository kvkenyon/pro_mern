'use strict';

const MongoClient = require('mongodb');

function usage() {
  console.log('Usage:');
  console.log('node', __filename,'<option>');
  console.log('Where option is one of:');
  console.log(' callbacks  Use the callbacks paradigm');
  console.log(' promises   Use the promises paradigm');
  console.log(' generator  Use the generator paradigm');
  console.log(' async      Use the async paradigm');
}

if (process.argv.length == 2) {
  console.log("Incorrect number of arguments");
  usage();
} else {
  const arg = process.argv[2];
  if (arg === 'callbacks') {
    testWithCallbacks();
  } else if (arg == 'promises') {
    testWithPromises();
  } else if (arg == 'generator') {
    testWithGenerator();
  } else if (arg == 'async') {
    testWithAsync();
  } else {
    console.log("Invalid option:", arg);
    usage();
  }
}

function testWithCallbacks() {
  MongoClient.connect('mongodb://localhost/playground', function(err, db) {
    db.collection('employees').insertOne({id: 1, name: 'Fook You'}, function(err, result) {
      console.log("Result of insert: " + result.insertedId);
      db.collection('employees').find({id: 1}).toArray(function(err, docs) {
        console.log('Result of find', docs);
        db.close();
      });
    });
  });

}

function testWithPromises() {
 let db;
 MongoClient.connect('mongodb://localhost/playground').then(connection => {
   db = connection;
   return db.collection('employees').insertOne({id: 1, name: 'B. Promises'});
 }).then(result => {
   console.log('Result of insert:', result.insertedId);
   let found =  db.collection('employees').find({id: 1}).toArray();
   return found;
 }).then(docs => {
   console.log('Result of find:', docs);
   db.close();
 }).catch(err => {
   console.log('ERROR', err);
 });
}

function testWithGenerator() {
  const co = require('co');
  co(function*() {
      const db = yield MongoClient.connect('mongodb://localhost/playground');

      const result = yield db.collection('employees').insertOne({id: 1, name: 'Generator Co. Leen'});
      console.log('Result of insert:', result.insertedId);

      const docs = yield db.collection('employees').find({id: 1}).toArray();
      console.log('Result of find:', docs);

      db.close();
  }).catch(err => {
    console.log(err);
  });
}

function testWithAsync() {

}
