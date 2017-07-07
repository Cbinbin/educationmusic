const router = require('express').Router()
  , AV = require('leanengine')
  , moment = require('moment')
  , msg = require('../../utils/msg')
  , changeComment = require('./functions/changeComment')
  , aboutComment = require('./functions/aboutComment')

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
      , types = user.get('types') || null
      , identity = types == 'teacher' ? user.get('teacher') : 
      (types == 'student' ? user.get('student') : null)
      , knowledges = []
    ownledges.forEach((oneledge)=> {
      var comments = oneledge.get('comments') || []
      comments = arr.clearNull(comments)
      knowledges.push({
        userId: user.id,
        identity: {
          realName: identity != null ? identity.get('realName') : null,
          img: identity != null ? identity.get('img') : null,
          objectId: identity != null ? identity.id : null
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

router.get('/comment', (req, res)=> {
  const userId = req.music.userId
  aboutComment(userId).then((allcomment)=> {
    var allcomments = []
    allcomment.forEach((commentone)=> {
      var own = commentone.get('own')
        , knowledge = commentone.get('knowledge')
        , comment = commentone.get('comment') ? commentone.get('comment') : null
      allcomments.push({
        knowledge: {
          knowledgeId: knowledge.id,
          text: knowledge.get('text')
        },
        own: {
          userId: own.id,
          types: own.get('types') || null,
          avatarUrl: own.get('avatarUrl') || null
        },
        ownName: commentone.get('ownName'),
        retext: commentone.get('retext'),
        other: commentone.get('other') || null,
        otherName: commentone.get('otherName') || null,
        comment: comment == null ? comment : {
          commentId: comment.id || null,
          retext: comment.get('retext') || null
        },
        objectId: commentone.id,
        createdAt: moment(commentone.createdAt).fromNow()
      })
    })
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: allcomments })
  })
})

module.exports = router