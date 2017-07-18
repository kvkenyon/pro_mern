import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import SourceMapSupport from 'source-map-support';
import Issue from './issue';

SourceMapSupport.install();

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

let db;

MongoClient.connect('mongodb://localhost/issuetracker').then((connection) => {
  db = connection;
  app.listen(3000, () => {
    console.log('App started on port 3000');
  });
}).catch((error) => {
  console.log('ERROR', error);
});

app.get('/api/issues', (req, res) => {
  db.collection('issues').find().toArray().then((issues) => {
    const metadata = { total_count: issues.length };
    res.json({ _metadata: metadata, records: issues });
  })
  .catch((err) => {
    console.log('ERROR:', err);
    res.status(500).json({ message: `Internal Server Error:${err}` });
  });
});

app.post('/api/issues', (req, res) => {
  const newIssue = req.body;
  newIssue.created = new Date();
  if (!newIssue.status) {
    newIssue.status = 'New';
  }
  const err = Issue.validateIssue(newIssue);

  if (err) {
    res.status(422).json({ message: `Invalid request: ${err}` });
    return;
  }

  db.collection('issues').insertOne(newIssue).then((result) => {
    newIssue._id = result.insertedId;
    res.json(newIssue);
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
});
