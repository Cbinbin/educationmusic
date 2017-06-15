const router = require('express').Router()
  , check = require('../utils/check')
  , checkto = new check

const teacher = require('./teacher/index')
const student = require('./student/index')
const user = require('./user')
const uploadimg = require('./uploadimg')

// checkto.token(router)

router.use('/teacher', teacher)
router.use('/student', student)
router.use('/user', user)
router.use('/uploadimg', uploadimg)

module.exports = router