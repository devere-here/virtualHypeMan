const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { ToDo } = require('../db/models');

module.exports = router;

router.get('/', asyncHandler(async (req, res, next) => {
  const toDoList = await ToDo.findAll()
  res.json(toDoList);
}));

router.post('/', asyncHandler(async (req, res, next) => {
  console.log('in post req.body is', req.body);
  const toDoList = await ToDo.create(req.body);
  console.log('toDoList is now', toDoList);
  res.json(toDoList);
}));

router.delete('/', asyncHandler(async (req, res, next) => {
  console.log('in delete req.body is', req.body);
  const toDoList = await ToDo.destroy({
    where: {
      task: req.body.task
    }
  });
  console.log('toDoList is now', toDoList);
  res.json(toDoList);
}));
