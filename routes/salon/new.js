const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , integralChange = require('../../funcs/integralChange')

router.post('/', (req, res)=> {
  const userId = req.music.userId
    , title = req.body.title
    , date = req.body.date
    , time = req.body.time
    , address = req.body.address
    , content = req.body.content
    , isFree = req.body.isFree === true || req.body.isFree === 'true' ? true : false
    , isOpen = req.body.isOpen === true || req.body.isOpen === 'true' ? true : false
    , modle = req.body.modle || undefined
  if(!title || !date || !time || !address || !content) return res.send({code: msg.noText[0], errMsg: msg.noText[1], data: '不能为空'})
  var userquery = new AV.Query('Usermusic')
  userquery.get(userId).then((user)=> {
    var types = user.get('types')
      , integral = user.get('integral')
      , userPot = AV.Object.createWithoutData('Usermusic', user.id)
    if(types != 'teacher') return res.send({code: msg.noPermiss[0], errMsg: msg.noPermiss[1], data: '非教师无法创建' })
    var  newsolon = new AV.Object('Salon')
    newsolon.set('user', userPot)
    newsolon.set('title', String(title))
    newsolon.set('date', String(date))
    newsolon.set('time', String(time))
    newsolon.set('address', String(address))
    newsolon.set('content', String(content))
    newsolon.set('isFree', isFree)
    newsolon.set('isOpen', isOpen)
    newsolon.set('modle', modle)
    if(req.body.phone) newsolon.set('phone', Number(req.body.phone))
    newsolon.set('startTime', new Date(`${date} ${time}`))
    newsolon.save().then((solon)=> {
      if(isFree && isOpen) {
        integralChange(50, user.id, '音乐沙龙🎵')
        user.set('integral', (integral + 50))
        user.save()
      }
      res.send({code: msg.postok[0], errMsg: msg.postok[1], data: solon })
    })
  })
})

module.exports = router