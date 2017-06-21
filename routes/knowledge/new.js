const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , integralChange = require('../../funcs/integralChange')

router.post('/', (req, res)=> {
  const userId = req.music.userId
    , text = req.body.text
  if(!text) return res.send({code: msg.noText[0], errMsg: msg.noText[1], data: '文本不能为空'})
  else if(text.split('').length < 15) return res.send({code: msg.failed[0], errMsg: msg.failed[1], data: '字数不少于15个'})
  var userPot = AV.Object.createWithoutData('Usermusic', userId)
    , newknowledge = new AV.Object('Knowledge')
  newknowledge.set('user', userPot)
  newknowledge.set('text', String(text))
  newknowledge.set('comments', [])
  newknowledge.save().then((newledge)=> {
    var queryuser = new AV.Query('Usermusic')
    queryuser.get(userId).then((user)=> {
      var integral = user.get('integral')
      integralChange(10, user.id, '知识天地')
      user.set('integral', (integral + 10))
      user.save()
    }, (err)=> {
      console.log(err)
    })
    res.send({code: msg.postok[0], errMsg: msg.postok[1], data: newledge })
  })
})

module.exports = router