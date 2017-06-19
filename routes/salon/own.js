const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.get('/', (req, res)=> {
  const userId = req.music.userId
  var userPot = AV.Object.createWithoutData('Usermusic', userId)
    , querysalon = new AV.Query('Salon')
  querysalon.equalTo('user', userPot)
  querysalon.descending('createdAt')
  querysalon.find().then((salons)=> {
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: salons })
  })
})

module.exports = router