const router = require('express').Router()
  , AV = require('leanengine')
  , moment = require('moment')
  , msg = require('../../utils/msg')
  , changeComment = require('./functions/changeComment')

router.get('/', (req, res)=> {
  // const userId = req.music.userId
  const kledgeid = req.query.kledgeid
  var querykledge = new AV.Query('Knowledge')
  querykledge.include('user')
  querykledge.include('comments')
  querykledge.include('user.teacher')
  querykledge.include('user.student')
  querykledge.get(kledgeid).then((oneledge)=> {
    var user = oneledge.get('user')
      , types = user.get('types')
      , identity = types == 'teacher' ? user.get('teacher') : 
      (types == 'student' ? user.get('student') : null)
      , comments = oneledge.get('comments')
    var knowledge = {
      userId: user.id,
      identity: {
        realName: identity.get('realName') || null,
        img: identity.get('img') || null,
        objectId: identity.id || null
      },
      text: oneledge.get('text'),
      comments: changeComment(comments),
      objectId: oneledge.id,
      createdAt: moment(oneledge.createdAt).fromNow()
    }
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: knowledge })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'kledgeid' })
  })
})

module.exports = router