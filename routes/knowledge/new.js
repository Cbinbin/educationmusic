const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.post('/', (req, res)=> {
  const userId = req.music.userId
    , text = req.body.text
  if(!text) return res.send({code: msg.noText[0], errMsg: msg.noText[1], data: '文本不能为空'})
  var userPot = AV.Object.createWithoutData('Usermusic', userId)
    , newknowledge = new AV.Object('Knowledge')
  newknowledge.set('user', userPot)
  newknowledge.set('text', String(text))
  newknowledge.set('comments', [])
  newknowledge.save().then((newledge)=> {
    res.send({code: msg.postok[0], errMsg: msg.postok[1], data: newledge })
  })
})

module.exports = router