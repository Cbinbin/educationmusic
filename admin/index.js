const router = require('express').Router()
  , check = require('../utils/check')
  , checkto = new check

const goods = require('./goods/index')
const knowledge = require('./knowledge')
const trade = require('./trade')
const wx = require('./wx')

checkto.adminToken(router)

router.use('/goods', goods)
router.use('/knowledge', knowledge)
router.use('/trade', trade)
router.use('/wx', wx)

module.exports = router