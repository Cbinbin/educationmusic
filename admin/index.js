const router = require('express').Router()
  , check = require('../utils/check')
  , checkto = new check

const goods = require('./goods/index')

checkto.adminToken(router)

router.use('/goods', goods)

module.exports = router