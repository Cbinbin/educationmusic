const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , salonFormat = require('./functions/salonFormat')

router.get('/', (req, res)=> {
  const userId = req.music.userId
  const salonid = req.query.salonid || undefined
  var querysalon = new AV.Query('Salon')
  querysalon.include('user')
  querysalon.include('user.teacher')
  querysalon.get(salonid).then((salon)=> {
    var salonre = salonFormat(salon)
    if(salonre.modle) {
      var querymodle = new AV.Query('Modle')
      querymodle.get(salonre.modle).then((modleone)=> {
        salonre.modle = {
          objectId: modleone.id,
          background: modleone.get('background')
        }
        res.send({code: msg.getok[0], errMsg: msg.getok[1], data: salonre })
      })
    } else res.send({code: msg.getok[0], errMsg: msg.getok[1], data: salonre })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'salonid' })
  })
})

module.exports = router