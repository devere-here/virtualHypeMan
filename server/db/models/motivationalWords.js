const Sequelize = require('sequelize');
const db = require('../db');

const MotivationalWords = db.define('motivationalWords', {
  keyWord: {
    type: Sequelize.STRING,
  },
  motivationalWords: {
    type: Sequelize.TEXT,
  },

});

module.exports = MotivationalWords;
