'use strict';

const express = require('express');
const fs      = require('fs');

const words   = fs.readFileSync('./words', 'utf-8').toLowerCase().split('\n');

// returns a random word from the words array.
function _randomWord() {
  let word = words[Math.floor(Math.random() * words.length)];
  if (word.charAt(word.length - 1) === '\r') {
    word = word.slice(0, word.length - 1);
  }
  return word;
}

/**
 * Processes a guess
 * @param {any[]} game 
 * @param {string} guess 
 */
const checkGuess = function(game, guess) {
  let correct        = false;
  let alreadyGuessed = false;
  for (let i = 0; i < game.wordArray.length; i++) {
    if (
      guess === game.wordArray[i].letter &&
      game.wordArray[i].revealed === false
    ) {
      correct = true;
      game.wordArray[i].revealed = true;
      game.hiddenLetterCount--;

      // check for win condition (revealing last hidden letter)
      if (!game.hiddenLetterCount) {
        game.win = true;
      }
    } else if (
      guess === game.wordArray[i].letter &&
      game.wordArray[i].revealed === true
    ) {
      alreadyGuessed = true;
    }
  }

  if (!correct && !alreadyGuessed) {
    game.badGuessArray.push(guess);
    game.remainingGuesses--;
    game.totalGuesses++;
  } else if (correct) {
    game.totalGuesses++;
  }

  // check for lose condition
  if (game.remainingGuesses === 0) {
    game.lose = true;
  }

  return game;
}

/**
 * Returns a fresh game object based on the given difficuly
 * @param {string} difficulty typically 'Easy', 'Normal', or 'Hard'
 */
const createGame = function(difficulty) {
  // find a suitable word
  let word = '';
  if (difficulty == 'Easy') {
    while (word.length <= 4 || word.length >= 6) {
      word = _randomWord();
    }
  } else if (difficulty == 'Normal') {
    while (word.length <= 6 || word.length >= 8) {
      word = _randomWord();
    }
  } else {
    difficulty = 'Hard';
    while (word.length <= 8) {
      word = _randomWord();
    }
  }

  // set up the game obj
  let badGuessArray = [];
  let wordArray  = [];
  for (let i = 0; i < word.length; i++) {
    wordArray.push({
      letter:   word.charAt(i),
      revealed: false
    });
  }

  let game = {
    word:              word,
    difficulty:        difficulty,
    wordArray:         wordArray,
    badGuessArray:     badGuessArray,
    hiddenLetterCount: wordArray.length,
    totalGuesses:      0,
    remainingGuesses:  8,
    win:               false,
    lose:              false,
    dictionary:        'https://www.merriam-webster.com/dictionary/' + word
  };

  return game;
};

module.exports = {
  checkGuess: checkGuess,
  createGame: createGame
}