const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { ToDo } = require('../db/models');
const axios = require('axios');


module.exports = router;


router.get('/', asyncHandler(async (req, res, next) => {
  const toDoList = await ToDo.findAll()
  res.json(toDoList);
}));
