const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost/playground', function(err, db) {
  db.collection('employees').find().toArray(function(err, docs) {
    console.log(docs);
    db.close();
  });
});
