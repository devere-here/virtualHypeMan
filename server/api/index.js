const router = require('express').Router()
module.exports = router

router.use('/phrases', require('./motivationalWords'));
router.use('/todolist', require('./toDoList'));
router.use('/apiRequests', require('./apiRequests'));

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
