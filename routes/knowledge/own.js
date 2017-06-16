const router = require('express').Router()
  , AV = require('leanengine')
  , moment = require('moment')
  , msg = require('../../utils/msg')
  , changeComment = require('./functions/changeComment')

router.get('/', (req, res)=> {
  const userId = req.music.userId
  var userPot = AV.Object.createWithoutData('Usermusic', userId)
    , querykledge = new AV.Query('Knowledge')
  querykledge.equalTo('user', userPot)
  querykledge.include('user')
  querykledge.include('comments')
  querykledge.include('user.teacher')
  querykledge.include('user.student')
  querykledge.descending('createdAt')
  querykledge.find().then((ownledges)=> {
    var user = ownledges[0].get('user')
      , types = user.get('types')
      , identity = types == 'teacher' ? user.get('teacher') : 
      (types == 'student' ? user.get('student') : null)
      , knowledges = []
    ownledges.forEach((oneledge)=> {
      var comments = oneledge.get('comments')
      knowledges.push({
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
      })
    })
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: knowledges })
  })
})

module.exports = router