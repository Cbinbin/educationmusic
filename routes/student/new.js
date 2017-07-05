const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.post('/', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
  queryuser.get(userId).then((userinfo)=> {
    var typeExist = userinfo.get('types') || null
      , avatarUrl = userinfo.get('avatarUrl')
      , userPot = AV.Object.createWithoutData('Usermusic', userinfo.id)
      , labels = req.body.labels === undefined ? [] : req.body.labels
    if(typeExist && typeExist != 'null' && typeExist != 'undefined') return res.send({code: msg.typeExist[0], errMsg: msg.typeExist[1], data: {} })
    // else if(labels.length > 3) return res.send({code: msg.failed[0], errMsg: msg.failed[1], data: 'labels长度不能大于三个' })
    var newstudent = new AV.Object('Student')
    if(req.body.img) newstudent.set('img', req.body.img)
      else newstudent.set('img', avatarUrl)
    newstudent.set('userId', userPot)
    newstudent.set('realName', req.body.realName)
    newstudent.set('gender', Number(req.body.gender))
    newstudent.set('labels', labels)
    newstudent.set('age', Number(req.body.age))
    newstudent.set('tasks', [])
    newstudent.set('myTeacher', [])
    newstudent.set('noticeNew', false)
    newstudent.save().then((iamstudent)=> {
      var studentPot = AV.Object.createWithoutData('Student', iamstudent.id)
      userinfo.set('student', studentPot)
      userinfo.set('types', 'student')
      userinfo.save()
      res.send({code: msg.postok[0], errMsg: msg.postok[1], data: iamstudent })
    })
  })
})

module.exports = router