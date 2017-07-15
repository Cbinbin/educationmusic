const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.post('/', (req, res)=> {
  const userId = req.music.userId
    , salonId = req.body.salonId || 'undefined'
  var userPot = AV.Object.createWithoutData('Usermusic', userId)
    , querysalon = new AV.Query('Salon')
  querysalon.get(salonId).then((exist)=> {
    var user = exist.get('user') || null
      , delsalon = AV.Object.createWithoutData('Salon', exist.id)
    if(user.id != userPot.id) return res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'userId' })
    delsalon.destroy().then(()=> {
      res.send({code: msg.postok[0], errMsg: msg.postok[1], data: 'deleted success' })
    })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'salonId' })
  })
})

module.exports = router