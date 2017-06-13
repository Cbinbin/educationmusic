const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../utils/msg')

router.get('/', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('teacher')
  queryuser.include('student')
  queryuser.get(userId).then((user)=> {
    var userData = {
      openId: user.get('openId'),
      teacher: user.get('teacher') || null,
      student: user.get('student') || null,
      city: user.get('city'),
      types: user.get('types') || null,
      nickName: user.get('nickName'),
      integral: user.get('integral'),
      cards: user.get('cards'),
      gender: user.get('gender'),
      province: user.get('province'),
      avatarUrl: user.get('avatarUrl'),
      objectId: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: userData })
  })
})

module.exports = router