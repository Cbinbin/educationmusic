const router = require('express').Router()
  , check = require('../utils/check')
  , checkto = new check

const goods = require('./goods/index')
const knowledge = require('./knowledge')

checkto.adminToken(router)

router.use('/goods', goods)
router.use('/knowledge', knowledge)

module.exports = router