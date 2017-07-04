const router = require('express').Router()

const newone = require('./new')
const find = require('./find')
const change = require('./change')
const myteacher = require('./myteacher')
const task = require('./task')
const shalong = require('./shalong')

router.use('/new', newone)
router.use('/find', find)
router.use('/change', change)
router.use('/myteacher', myteacher)
router.use('/task', task)
router.use('/shalong', shalong)

module.exports = router