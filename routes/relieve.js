const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../utils/msg')

router.post('/', (req, res)=> {
  const userId = req.music.userId
    , relieve = req.body.relieve
  if(relieve != 'teacher' && relieve != 'student') return res.send({code: msg.typeExist[0], errMsg: msg.typeExist[1], data: `relieve只能为'teacher'或'student'` })
  var queryuser = new AV.Query('Usermusic')
  queryuser.get(userId).then((user)=> {
    var types = user.get('types')
      , identity = types == 'teacher' ? user.get('teacher') : 
                  (types == 'student' ? user.get('student') : null)
    if(types != relieve) return res.send({code: msg.failed[0], errMsg: msg.failed[1], data: '解除的身份和你的不同' })
    // identity.destroy()
    user.set('types', 'undefined')
    if(types == 'teacher') user.set('teacher', null)
    if(types == 'student') user.set('student', null)
    user.save().then((updateuser)=> {
      res.send({code: msg.postok[0], errMsg: msg.postok[1], data: 'relieved success' })
    })
  })
})

module.exports = router