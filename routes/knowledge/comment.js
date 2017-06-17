const router = require('express').Router()
  , AV = require('leanengine')
  , moment = require('moment')
  , msg = require('../../utils/msg')
  , arrx = require('../../utils/arrx')
  , arr = new arrx

router.post('/', (req, res)=> {
  const userId = req.music.userId
    , kledgeId = req.body.kledgeId
    , retext = req.body.retext
    , commentId = req.body.commentId
  if(!retext) return res.send({code: msg.noText[0], errMsg: msg.noText[1], data: 'retext不能为空' })
  var querykledge = new AV.Query('Knowledge')
    , queryuser = new AV.Query('Usermusic')
  queryuser.include('teacher')
  queryuser.include('student')
  queryuser.get(userId).then((user)=> {
    querykledge.get(kledgeId).then((kledge)=> {
      var knowledgePot = AV.Object.createWithoutData('Knowledge', kledge.id)
        , userPot = AV.Object.createWithoutData('Usermusic', user.id)
        , newcomment = new AV.Object('Comment')
        , types = user.get('types')
        , userName = types == 'teacher' ? user.get('teacher').get('realName') : 
                    (types == 'student' ? user.get('student').get('realName') : '')
        , comments = kledge.get('comments')
      if(commentId) {
        var querycomment = new AV.Query('Comment')
        querycomment.include('own')
        querycomment.include('own.teacher')
        querycomment.include('own.student')
        querycomment.get(commentId).then((othercomment)=> {
          var other = othercomment.get('own')
            , commentPot = AV.Object.createWithoutData('Comment', othercomment.id)
            , otherPot = AV.Object.createWithoutData('Usermusic', other.id)
            , otherTypes = other.get('types')
            , otherName = otherTypes == 'teacher' ? other.get('teacher').get('realName') : 
                         (otherTypes == 'student' ? other.get('student').get('realName') : '')
          newcomment.set('own', userPot)
          newcomment.set('ownName', userName)
          newcomment.set('knowledge', knowledgePot)
          newcomment.set('comment', commentPot)
          newcomment.set('other', otherPot)
          newcomment.set('otherName', otherName)
          newcomment.set('retext', String(retext))
          newcomment.save().then((comment)=> {
            var commentcn = AV.Object.createWithoutData('Comment', comment.id)
            comments.push(commentcn)
            knowledgePot.set('comments', comments)
            knowledgePot.save()
            res.send({code: msg.postok[0], errMsg: msg.postok[1], data: comment })
          })
        }, (err)=> {
          res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'commentId' })
        })
      } else {
        newcomment.set('own', userPot)
        newcomment.set('ownName', userName)
        newcomment.set('knowledge', knowledgePot)
        newcomment.set('retext', String(retext))
        newcomment.save().then((comment)=> {
          var commentcn = AV.Object.createWithoutData('Comment', comment.id)
          comments.push(commentcn)
          knowledgePot.set('comments', comments)
          knowledgePot.save()
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: comment })
        })
      }
    }, (err)=> {
      res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'kledgeId' })
    })
  })
})

router.post('/delone', (req, res)=> {
  const userId = req.music.userId
    ,  commentId = req.body.commentId
  var querycomment = new AV.Query('Comment')
  querycomment.include('knowledge')
  querycomment.get(commentId).then((comment)=> {
    var own = comment.get('own')
      , knowledge = comment.get('knowledge')
      , comments = knowledge.get('comments')
    if(own.id !== userId) return res.send({code: msg.notYours[0], errMsg: msg.notYours[1], data: 'commentId' })
    var delcomment = AV.Object.createWithoutData('Comment', comment.id)
      , updateknowledge = AV.Object.createWithoutData('Knowledge', knowledge.id)
      , queryothercomment = new AV.Query('Comment')
    queryothercomment.equalTo('comment', delcomment)
    queryothercomment.find().then((othercomments)=> {
      othercomments.forEach((commentone)=> {
        var delothercomment = AV.Object.createWithoutData('Comment', commentone.id)
        comments = arr.pruneOnePot(delothercomment, comments)
        updateknowledge.set('comments', comments)
        updateknowledge.save()
        delothercomment.destroy()
      })
    })
    comments = arr.pruneOnePot(delcomment, comments)
    updateknowledge.set('comments', comments)
    updateknowledge.save()
    delcomment.destroy().then(()=> {
      res.send({code: msg.postok[0], errMsg: msg.postok[1], data: 'deleted success' })
    })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'commentId' })
  })
})

module.exports = router