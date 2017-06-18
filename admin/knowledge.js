const router = require('express').Router()
  , AV = require('leanengine')
  , moment = require('moment')
  , msg = require('../utils/msg')
  , changeComment = require('../routes/knowledge/functions/changeComment')

router.get('/list', (req, res)=> {
  var querykledge = new AV.Query('Knowledge')
  querykledge.include('user')
  querykledge.include('user.teacher')
  querykledge.include('user.student')
  querykledge.include('comments')
  querykledge.descending('createdAt')
  querykledge.find().then((ownledges)=> {
    var knowledges = []
    ownledges.forEach((oneledge)=> {
      var user = oneledge.get('user')
        , types = user.get('types')
        , identity = types == 'teacher' ? user.get('teacher') : 
        (types == 'student' ? user.get('student') : null)
        , comments = oneledge.get('comments') || null
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

router.post('/del', (req, res)=> {
  var kledgeId = req.body.kledgeId
  var querykledge = new AV.Query('Knowledge')
  querykledge.get(kledgeId).then((kledge)=> {
    var delkledge = AV.Object.createWithoutData('Knowledge', kledge.id)
      , querycomment = new AV.Query('Comment')
    querycomment.equalTo('knowledge', delkledge)
    querycomment.find().then((comments)=> {
      comments.forEach((commentone)=> {
         var delcomment = AV.Object.createWithoutData('Comment', commentone.id)
         delcomment.destroy()
      })
    })
    delkledge.destroy().then(()=> {
      res.send({code: msg.postok[0], errMsg: msg.postok[1], data: 'deleted success' })
    })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'kledgeId' })
  })
})

module.exports = router