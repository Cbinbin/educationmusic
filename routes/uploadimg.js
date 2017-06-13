const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../utils/msg')
  , qcos = require('../utils/qcos')

router.post('/', (req, res)=> {
  qcos.upload(req, res, 'music/imgs').then((imgUrl)=> {
    res.send({code: msg.postok[0], errMsg: msg.postok[1], data: imgUrl })
  })
})

module.exports = router