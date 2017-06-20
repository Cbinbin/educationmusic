const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.get('/', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('student')
  queryuser.get(userId).then((user)=> {
    var student = user.get('student')
      , userre = {
      student: {
        labels: student.get('labels'),
        tasks: student.get('tasks'),
        myTeacher: student.get('myTeacher'),
        gender: student.get('gender') || 0,
        age: student.get('age') || 0,
        realName: student.get('realName') || null,
        img: student.get('img') || null,
        objectId: student.id,
        createdAt: student.createdAt
      },
      types: user.get('types') || null,
      nickName: user.get('nickName') || null,
      integral: user.get('integral') || 0,
      salonModles: user.get('salonModles') || [],
      avatarUrl: user.get('avatarUrl') || null,
      objectId: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: userre })
  })
})

module.exports = router