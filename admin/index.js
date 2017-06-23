const router = require('express').Router()
  , check = require('../utils/check')
  , checkto = new check

const goods = require('./goods/index')
const knowledge = require('./knowledge')
const trade = require('./trade')

checkto.adminToken(router)

router.use('/goods', goods)
router.use('/knowledge', knowledge)
router.use('/trade', trade)

module.exports = router