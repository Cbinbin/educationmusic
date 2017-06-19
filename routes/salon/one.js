const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.get('/', (req, res)=> {
  //const userId = req.music.userId
  const salonid = req.query.salonid || undefined
  var querysalon = new AV.Query('Salon')
  querysalon.get(salonid).then((salon)=> {
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: salon })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'salonid' })
  })
})

module.exports = router