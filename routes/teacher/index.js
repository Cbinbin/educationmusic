const router = require('express').Router()

const newone = require('./new')
const find = require('./find')
const change = require('./change')
const assignment = require('./assignment')
const video = require('./video')
const mystudent = require('./mystudent')
const piechart = require('./piechart')

router.use('/new', newone)
router.use('/find', find)
router.use('/change', change)
router.use('/assignment', assignment)
router.use('/video', video)
router.use('/mystudent', mystudent)
router.use('/piechart', piechart)

module.exports = router