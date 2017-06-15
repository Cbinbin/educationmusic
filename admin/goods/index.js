const router = require('express').Router()

const change = require('./change')
const create = require('./create')
const list = require('./list')

router.use('/change', change)
router.use('/create', create)
router.use('/list', list)

module.exports = router