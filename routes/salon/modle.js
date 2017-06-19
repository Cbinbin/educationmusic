const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.get('/', (req, res)=> {
  const userId = req.music.userId
  res.send({code: msg.getok[0], errMsg: msg.getok[1], data: '' })
})

module.exports = router