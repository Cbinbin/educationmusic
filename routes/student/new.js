const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.post('/', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('User')
  queryuser.get(userId).then((userinfo)=> {
    var userPot = AV.Object.createWithoutData('User', userinfo.id)
    var newstudent = new AV.Object('Student')
    newstudent.set('userId', userPot)
    newstudent.set('img', req.body.img)
    newstudent.set('realName', req.body.realName)
    newstudent.set('gender', Number(req.body.gender))
    newstudent.set('introduction', req.body.introduction)
    newstudent.set('labels', req.body.labels)
    newstudent.set('tasks', [])
    newstudent.set('myTeacher', [])
    newstudent.save().then((iamstudent)=> {
      var studentPot = AV.Object.createWithoutData('Student', iamstudent.id)
      userinfo.set('student', studentPot)
      userinfo.set('types', 'student')
      userinfo.save()
      res.send({code: msg.postok[0], errMsg: msg.postok[1], data: iamstudent })
    })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: err })
  })
})

module.exports = router