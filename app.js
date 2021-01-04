'use strict';

const express    = require('express');
const fs         = require('fs');
const bodyParser = require('body-parser');
const jsonfile   = require('jsonfile');
const expressValidator = require('express-validator');

// secret may need to go here.

const routes = require('./routes.js');
const data   = require('./data.js');

// create app
const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());

// cors
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://mystery-word-app.web.app/');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

app.use(routes);

app.listen(process.env.PORT || 3000, function() {
  console.log(
    'Express server listening on port %d in %s mode',
    this.address().port,
    app.settings.env
  );
});
