const router = require('express').Router()
  , check = require('../utils/check')
  , checkto = new check

const teacher = require('./teacher/index')
const student = require('./student/index')
const user = require('./user')
const uploadimg = require('./uploadimg')
const trade = require('./trade')
const goods = require('./goods')

checkto.token(router)

router.use('/teacher', teacher)
router.use('/student', student)
router.use('/user', user)
router.use('/uploadimg', uploadimg)
router.use('/trade', trade)
router.use('/goods', goods)

module.exports = router