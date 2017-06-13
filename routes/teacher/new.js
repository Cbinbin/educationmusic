const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , qcos = require('../../utils/qcos')

router.post('/', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
  queryuser.get(userId).then((userinfo)=> {
    var typeExist = userinfo.get('types') || null
      , avatarUrl = userinfo.get('avatarUrl')
    if(typeExist && typeExist != 'null') return res.send({code: msg.typeExist[0], errMsg: msg.typeExist[1], data: {} })
    var userPot = AV.Object.createWithoutData('Usermusic', userinfo.id)
      , labels = req.body.labels === undefined ? [] : req.body.labels
    var newteacher = new AV.Object('Teacher')
    newteacher.set('userId', userPot)
    newteacher.set('lat', Number(req.body.lat))
    newteacher.set('lng', Number(req.body.lng))
    if(req.body.img) newteacher.set('img', req.body.img)
      else newteacher.set('img', avatarUrl)
    newteacher.set('realName', req.body.realName)
    newteacher.set('gender', Number(req.body.gender))
    newteacher.set('introduction', req.body.introduction)
    newteacher.set('labels', labels)
    newteacher.set('certs', [])
    newteacher.set('salons', [])
    newteacher.set('videos', [])
    newteacher.set('myStudent', [])
    newteacher.set('assignments', [])
    newteacher.save().then((iamteacher)=> {
      var teacherPot = AV.Object.createWithoutData('Teacher', iamteacher.id)
      userinfo.set('teacher', teacherPot)
      userinfo.set('types', 'teacher')
      userinfo.save()
      res.send({code: msg.postok[0], errMsg: msg.postok[1], data: iamteacher })
    })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: err })
  })
})

module.exports = router