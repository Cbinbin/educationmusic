const router = require('express').Router()
  , check = require('../utils/check')
  , checkto = new check

const teacher = require('./teacher/index')
const student = require('./student/index')
const user = require('./user')

checkto.token(router)

router.use('/teacher', teacher)
router.use('/student', student)
router.use('/user', user)

module.exports = router