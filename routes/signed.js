const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../utils/msg')
  , integralChange = require('../funcs/integralChange')
  , datetime = require('../utils/datetime')
  , dt = new datetime

router.get('/', (req, res)=> {
  const userId = req.music.userId
    , nowdate = new Date()
  var objdate = dt.splitDate(nowdate)
  var querysign = new AV.Query('Signed')
    , queryuser = new AV.Query('Usermusic')
    , userPot = AV.Object.createWithoutData('Usermusic', userId)
  querysign.equalTo('user', userPot)
  querysign.equalTo('year_mon', `${objdate.year}_${objdate.month}`)
  queryuser.get(userId).then((user)=> {
    querysign.find().then((signs)=> {
      var integral = user.get('integral')
      if(signs[0]) {
        var nowsigned = signs[0].get(`day${objdate.day}`) || false
        if(nowsigned) return res.send({code: msg.alreadySigned[0], errMsg: msg.alreadySigned[1], data: '已开工' })
        else {
          var updatesign = AV.Object.createWithoutData('Signed', signs[0].id)
          updatesign.set(`day${objdate.day}`, true)
          updatesign.save().then(()=> {
            integralChange(10, user.id, '打卡开工')
            user.set('integral', (integral + 10)).save()
            res.send({code: msg.getok[0], errMsg: msg.getok[1], data: 'signed success' })
          })
        }
      } else {
        var newsign = new AV.Object('Signed')
        newsign.set('user', userPot)
        newsign.set('year_mon', `${objdate.year}_${objdate.month}`)
        newsign.set(`day${objdate.day}`, true)
        newsign.save().then(()=> {
          integralChange(10, user.id, '打卡开工')
          user.set('integral', (integral + 10)).save()
          res.send({code: msg.getok[0], errMsg: msg.getok[1], data: 'signed success' })
        })
      }
    })
  })
})

module.exports = router