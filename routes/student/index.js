const router = require('express').Router()

const newone = require('./new')
const find = require('./find')

router.use('/new', newone)
router.use('/find', find)

module.exports = router