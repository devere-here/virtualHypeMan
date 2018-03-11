const Sequelize = require('sequelize');
const db = require('../db');

const ToDo = db.define('todo', {
  task: {
    type: Sequelize.STRING
  }
});

module.exports = ToDo;
