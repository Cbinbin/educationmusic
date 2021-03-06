const router = require('express').Router()
  , AV = require('leanengine')
  , moment = require('moment')
  , msg = require('../utils/msg')
  , arrx = require('../utils/arrx')
  , changeComment = require('../routes/knowledge/functions/changeComment')
  , arr = new arrx

router.get('/list', (req, res)=> {
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
          , types = user.get('types') || null
          , identity = types == 'teacher' ? user.get('teacher') : 
          (types == 'student' ? user.get('student') : null)
          , comments = oneledge.get('comments') || null
        comments = arr.clearNull(comments)
        knowledges.push({
          userId: user.id,
          identity: {
            realName: identity != null ? identity.get('realName') : null,
            img: identity != null ? identity.get('img') : null,
            objectId: identity != null ? identity.id : null
          },
          text: oneledge.get('text'),
          top: oneledge.get('top'),
          comments: changeComment(comments),
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

router.post('/del', (req, res)=> {
  var kledgeId = req.body.kledgeId
  var querykledge = new AV.Query('Knowledge')
  querykledge.get(kledgeId).then((kledge)=> {
    var delkledge = AV.Object.createWithoutData('Knowledge', kledge.id)
      , querycomment = new AV.Query('Comment')
      , top = kledge.get('top')
    querycomment.equalTo('knowledge', delkledge)
    querycomment.find().then((comments)=> {
      comments.forEach((commentone)=> {
         var delcomment = AV.Object.createWithoutData('Comment', commentone.id)
         delcomment.destroy()
      })
    })
    if(top) {
      var querytop = new AV.Query('Top')
      querytop.equalTo('adminId', 'admin')
      querytop.find().then((tops)=> {
        if(tops[0]) {
          var klgtop = tops[0].get('klgtop') || []
          klgtop = arr.pruneOne(kledge.id, klgtop)
          tops[0].set('klgtop', klgtop)
          tops[0].save()
        }
      })
    }
    delkledge.destroy().then(()=> {
      res.send({code: msg.postok[0], errMsg: msg.postok[1], data: 'deleted success' })
    })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'kledgeId' })
  })
})

router.post('/top', (req, res)=> {
  const adminId = req.musicadmin.id
  const kledgeId = req.body.kledgeId
  var querytop = new AV.Query('Top')
    , updatekledge = AV.Object.createWithoutData('Knowledge', kledgeId)
  querytop.equalTo('adminId', 'admin')
  querytop.find().then((tops)=> {
    if(tops[0]) {
      var klgtop = tops[0].get('klgtop') || []
        , klgNum = tops[0].get('klgNum') || 1
      if(klgtop.length >= klgNum) return res.send({code: msg.failed[0], errMsg: msg.failed[1], data: '不能超过3个' })
      else if(arr.inTo(klgtop, kledgeId)) return res.send({code: msg.failed[0], errMsg: msg.failed[1], data: '已置顶' })
      klgtop.push(kledgeId)
      tops[0].set('klgtop', klgtop)
      tops[0].save().then((topup)=> {
        updatekledge.set('top', true)
        updatekledge.save()
        res.send({code: msg.postok[0], errMsg: msg.postok[1], data: topup })
      })
    } else {
      var newtop = new AV.Object('Top')
      newtop.set('adminId', 'admin')
      newtop.set('klgtop', [kledgeId])
      newtop.set('klgNum', 3)
      newtop.save().then((topone)=> {
        updatekledge.set('top', true)
        updatekledge.save()
        res.send({code: msg.postok[0], errMsg: msg.postok[1], data: topone })
      })
    }
  }, (err)=> {
    console.log(err)
    // var newtop = new AV.Object('Top')
    // newtop.set('adminId', 'admin')
    // newtop.set('klgtop', [kledgeId])
    // newtop.set('klgNum', 3)
    // newtop.save().then((topone)=> {
    //   res.send({code: msg.postok[0], errMsg: msg.postok[1], data: topone })
    // })
  })
})

router.post('/qxtop', (req, res)=> {
  const adminId = req.musicadmin.id
  const kledgeId = req.body.kledgeId
  var querytop = new AV.Query('Top')
  querytop.equalTo('adminId', 'admin')
  querytop.find().then((tops)=> {
    if(tops[0]) {
      var klgtop = tops[0].get('klgtop')
      arr.pruneOne(kledgeId, klgtop)
      tops[0].set('klgtop', klgtop)
      tops[0].save().then((topup)=> {
        var updatekledge = AV.Object.createWithoutData('Knowledge', kledgeId)
        updatekledge.set('top', false)
        updatekledge.save()
        res.send({code: msg.postok[0], errMsg: msg.postok[1], data: topup })
      })
    } else {
      res.send({code: msg.failed[0], errMsg: msg.failed[1], data: '不存在置顶' })
    }
  })
})

router.post('/comment/del', (req, res)=> {
  const adminId = req.musicadmin.id
  const commentId = req.body.commentId
  var querycomment = new AV.Query('Comment')
  querycomment.get(commentId).then((comment)=> {
    var delcomment = AV.Object.createWithoutData('Comment', comment.id)
      , queryaboutcomment = new AV.Query('Comment')
    queryaboutcomment.equalTo('comment', delcomment)
    queryaboutcomment.find().then((aboutcomments)=> {
      aboutcomments.forEach((aboutcomment)=> {
         var delaboutcomment = AV.Object.createWithoutData('Comment', aboutcomment.id)
         delaboutcomment.destroy()
      })
      delcomment.destroy().then(()=> {
        res.send({code: msg.postok[0], errMsg: msg.postok[1], data: 'deleted success' })
      })
    })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'commentId' })
  })
})

module.exports = router