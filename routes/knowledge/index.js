const router = require('express').Router()

const newone = require('./new')
const whole = require('./whole')
const single = require('./single')
const own = require('./own')
const comment = require('./comment')
const delone = require('./delone')

router.use('/new', newone)
router.use('/whole', whole)
router.use('/single', single)
router.use('/own', own)
router.use('/comment', comment)
router.use('/delone', delone)

module.exports = router