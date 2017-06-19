const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.get('/', (req, res)=> {
  const userId = req.music.userId
    // , nowtime = new Date()
    // , nexttime = new Date(nowtime.getTime() + (2*7*24*60*60*1000-1))
  var querysalon = new AV.Query('Salon')
  // querysalon.greaterThan('startTime', nowtime)
  // querysalon.lessThanOrEqualTo('startTime', nexttime)
  querysalon.descending('createdAt')
  querysalon.find().then((salons)=> {
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: salons })
  })
})

module.exports = router