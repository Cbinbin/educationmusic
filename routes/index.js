const router = require('express').Router()
  , check = require('../utils/check')
  , checkto = new check

const teacher = require('./teacher/index')
const student = require('./student/index')
const knowledge = require('./knowledge/index')
const salon = require('./salon/index')
const user = require('./user')
const uploadimg = require('./uploadimg')
const trade = require('./trade')
const goods = require('./goods')
const signed = require('./signed')
const relieve = require('./relieve')

checkto.token(router)

router.use('/teacher', teacher)
router.use('/student', student)
router.use('/knowledge', knowledge)
router.use('/salon', salon)
router.use('/user', user)
router.use('/uploadimg', uploadimg)
router.use('/trade', trade)
router.use('/goods', goods)
router.use('/signed', signed)
router.use('/relieve', relieve)

module.exports = router