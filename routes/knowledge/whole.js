const router = require('express').Router()
  , AV = require('leanengine')
  , moment = require('moment')
  , msg = require('../../utils/msg')
  , changeComment = require('./functions/changeComment')

router.get('/', (req, res)=> {
  var querykledge = new AV.Query('Knowledge')
    , querytop = new AV.Query('Top')
  querykledge.include('user')
  querykledge.include('user.teacher')
  querykledge.include('user.student')
  querykledge.include('comments')
  querykledge.descending('createdAt')
  querykledge.find().then((ownledges)=> {
    querytop.equalTo('adminId', 'admin')
    querytop.find().then((tops)=> {
      var knowledges = []
        , knowledgestop = []
      ownledges.forEach((oneledge)=> {
        var user = oneledge.get('user')
          , types = user.get('types')
          , identity = types == 'teacher' ? user.get('teacher') : 
          (types == 'student' ? user.get('student') : null)
          , comments = oneledge.get('comments')
        knowledges.push({
          userId: user.id,
          identity: {
            realName: identity.get('realName') || null,
            img: identity.get('img') || null,
            objectId: identity.id || null
          },
          text: oneledge.get('text'),
          comments: changeComment(comments),
          top: oneledge.get('top') || false,
          objectId: oneledge.id,
          createdAt: moment(oneledge.createdAt).fromNow()
        })
      })
      knowledgestop = knowledges
      if(tops[0]) {
        var klgtop = tops[0].get('klgtop')
        klgtop.map((topId)=> {
          knowledges.forEach((onekledge, i)=> {
            if(topId == onekledge.objectId) {
              knowledgestop.splice(i, 1)
              knowledgestop.unshift(onekledge)
            }
          })
        })
      }
      res.send({code: msg.getok[0], errMsg: msg.getok[1], data: knowledgestop })
    })
  })
})

module.exports = router