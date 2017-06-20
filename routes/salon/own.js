const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , salonFormat = require('./functions/salonFormat')

router.get('/', (req, res)=> {
  const userId = req.music.userId
  var userPot = AV.Object.createWithoutData('Usermusic', userId)
    , querysalon = new AV.Query('Salon')
  querysalon.equalTo('user', userPot)
  querysalon.include('user')
  querysalon.include('user.teacher')
  querysalon.descending('createdAt')
  querysalon.find().then((salons)=> {
    var salones = []
    salons.forEach((salon)=> {
      salones.push(salonFormat(salon))
    })
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: salones })
  })
})

module.exports = router