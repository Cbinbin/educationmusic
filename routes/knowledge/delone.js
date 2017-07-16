const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.post('/', (req, res)=> {
  const userId = req.music.userId
    , kledgeId = req.body.kledgeId
  var querykledge = new AV.Query('Knowledge')
    , userPot = AV.Object.createWithoutData('Usermusic', userId)
  querykledge.get(kledgeId).then((kledge)=> {
    var user = kledge.get('user')
    if(user.id !== userPot.id) return res.send({code: msg.notYours[0], errMsg: msg.notYours[1], data: 'kledgeId' })
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

module.exports = router