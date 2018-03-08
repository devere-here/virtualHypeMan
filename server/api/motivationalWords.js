const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { MotivationalWords } = require('../db/models');

module.exports = router;


router.get('/', asyncHandler(async (req, res, next) => {
  const motivationalWords = await MotivationalWords.findAll()
  res.json(motivationalWords);
}));


