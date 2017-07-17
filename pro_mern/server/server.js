"use strict";

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

const Issue = require('./issue.js');

const MongoClient = require('mongodb').MongoClient;

let db;

MongoClient.connect('mongodb://localhost/issuetracker').then(connection => {
  db = connection;
  app.listen(3000, function() {
    console.log('App started on port 3000');
  });
}).catch(error => {
  console.log('ERROR', error);
});

if (process.env.NODE_ENV !== 'production') {
    console.log("Setting up webpack..");
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');

    const config = require('../webpack.config');
    console.log(config.output.path);
    config.entry.app.push('webpack-hot-middleware/client', 'webpack/hot/only-dev-server');
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    const bundler = webpack(config);
    app.use(webpackDevMiddleware(bundler, { noInfo: false }));
    app.use(webpackHotMiddleware(bundler, { log: console.log }));
}

app.get('/api/issues', (req, res) => {
    db.collection('issues').find().toArray().then(issues => {
      const metadata = {total_count: issues.length};
      res.json({_metadata: metadata, records: issues});
    }).catch(err => {
      console.log('ERROR:', err);
      res.status(500).json({message: `Internal Server Error:${err}`});
    });
});

app.post('/api/issues', (req, res) => {
    const newIssue = req.body;
    newIssue.created = new Date();
    if (!newIssue.status) {
        newIssue.status = 'New';
    }
    console.log(newIssue);
    const err = Issue.validateIssue(newIssue);

    if (err) {
      res.status(422).json({message: `Invalid request: ${err}`});
      return;
    }

    db.collection('issues').insertOne(newIssue).then(result => {
      newIssue._id = result.insertedId;
      res.json(newIssue);
    }).catch(error => {
      console.log(error);
      res.status(500).json({message: `Internal Server Error: ${error}`});
    });
});
