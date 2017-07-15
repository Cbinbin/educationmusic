const router = require('express').Router()
  , AV = require('leanengine')
  , moment = require('moment')
  , msg = require('../utils/msg')
  , salonFormat = require('../routes/salon/functions/salonFormat')

router.get('/all', (req, res)=> {
  var querysalon = new AV.Query('Salon')
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

router.post('/del', (req, res)=> {
  const salonId = req.body.salonId || 'undefined'
  var querysalon = new AV.Query('Salon')
  querysalon.get(salonId).then((exist)=> {
    var delsalon = AV.Object.createWithoutData('Salon', exist.id)
    delsalon.destroy().then(()=> {
      res.send({code: msg.postok[0], errMsg: msg.postok[1], data: 'deleted success' })
    })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'salonId' })
  })
})

module.exports = router