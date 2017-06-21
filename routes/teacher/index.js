const router = require('express').Router()

const newone = require('./new')
const find = require('./find')
const change = require('./change')
const assignment = require('./assignment')

router.use('/new', newone)
router.use('/find', find)
router.use('/change', change)
router.use('/assignment', assignment)

module.exports = router