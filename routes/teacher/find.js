const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.get('/', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('teacher')
  queryuser.get(userId).then((user)=> {
    var teacher = user.get('teacher')
      , userre = {
      teacher: {
        labels: teacher.get('labels'),
        assignments: teacher.get('assignments'),
        myStudent: teacher.get('myStudent'),
        salons: teacher.get('salons'),
        rqcode: teacher.get('rqcode') || null,
        videos: teacher.get('videos'),
        certs: teacher.get('certs'),
        gender: teacher.get('gender') || 0,
        introduction: teacher.get('introduction') || null,
        realName: teacher.get('realName') || null,
        img: teacher.get('img') || null,
        objectId: teacher.id,
        createdAt: teacher.createdAt
      },
      types: user.get('types') || null,
      nickName: user.get('nickName') || null,
      integral: user.get('integral') || 0,
      cards: user.get('cards') || [],
      avatarUrl: user.get('avatarUrl') || null,
      objectId: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: userre })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: err })
  })
})

module.exports = router