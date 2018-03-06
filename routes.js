'use strict';

const express    = require('express');
const router     = express.Router();
const fs         = require('fs');
const bodyParser = require('body-parser');
const jsonfile   = require('jsonfile');
const expressValidator = require('express-validator');

const data = require('./data.js');

// winners file setup
const file = 'winners.json';
let winners;
jsonfile.readFile(file, function(err, obj) {
  winners = obj;
});

router.get('/', function(req, res) {
  console.log('GET /');
  res.send('something for GET /');
});

router.post('/new', function(req, res) {
  console.log('POST /new');
  // create a new game.
  if (req.body.difficulty) {
    const game = data.createGame(req.body.difficulty);
    res.send(game);
  } else {
    res.status(400);
    res.send('Could not create game, no difficulty given.');
  }
});

router.post('/play', function(req, res) {
  console.log('POST /play');
  // console.log('req.body', req.body);
  let game = req.body.game;
  const guess = req.body.guess;
  game = data.checkGuess(game, guess);
  res.send(game);
});

router.post('/win', function(req, res) {
  console.log('POST /win')
  const game = req.body.game;
  req.checkBody('name', 'You must enter a name!').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    res.status(400);
    res.send(errors);
  } else {
    const name = req.body.name;
    const id = winners.winners.length;
    winners.winners.push({
      id: id,
      name: name,
      word: game.word,
      guesses: game.totalGuesses,
      difficulty: game.difficulty
    });
    jsonfile.writeFileSync(file, winners);
    res.send(winners);
  }
});

router.get('/winners', function(req, res) {
  console.log('GET /winners');
  res.send(winners.winners);
});

module.exports = router;
