const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.post('/', (req, res)=> {
  const userId = req.music.userId
    , show = req.body.show === true ? true : false
  var queryuser = new AV.Query('User')
  queryuser.get(userId).then((userinfo)=> {
    var userPot = AV.Object.createWithoutData('User', userinfo.id)
    var newteacher = new AV.Object('Teacher')
    newteacher.set('userId', userPot)
    newteacher.set('lat', Number(req.body.lat))
    newteacher.set('lng', Number(req.body.lng))
    newteacher.set('img', req.body.img)
    newteacher.set('realName', req.body.realName)
    newteacher.set('gender', Number(req.body.gender))
    newteacher.set('introduction', req.body.introduction)
    newteacher.set('labels', req.body.labels)
    newteacher.set('show', show)
    newteacher.set('rqcode', req.body.rqcode)
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