const router = require('express').Router()

const newone = require('./new')
const find = require('./find')
const change = require('./change')

router.use('/new', newone)
router.use('/find', find)
router.use('/change', change)

module.exports = router