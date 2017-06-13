const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../utils/msg')

router.get('/', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('teacher')
  queryuser.include('student')
  queryuser.get(userId).then((user)=> {
    res.send({code: msg.postok[0], errMsg: msg.postok[1], data: user })
  })
})

module.exports = router