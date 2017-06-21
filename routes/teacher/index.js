const router = require('express').Router()

const newone = require('./new')
const find = require('./find')
const change = require('./change')
const assignment = require('./assignment')
const video = require('./video')

router.use('/new', newone)
router.use('/find', find)
router.use('/change', change)
router.use('/assignment', assignment)
router.use('/video', video)

module.exports = router