const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , qcos = require('../../utils/qcos')
  , arrx = require('../../utils/arrx')
  , arr = new arrx

router.post('/', (req, res)=> {
  const userId = req.music.userId
    , show = req.body.show === true ? true : false
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('teacher')
  queryuser.get(userId).then((userinfo)=> {
    var teacherId = String(userinfo.get('teacher').id)
      , queryteacher = new AV.Query('Teacher')
    qcos.upload(req, res, 'music/imgs').then((imgUrl)=> {
      queryteacher.get(teacherId).then((teacherone)=> {
        var labels = teacherone.get('labels')
          , imgurl = teacherone.get('img')
        if(req.body.addlabel) labels = arr.insertOne(req.body.addlabel, labels)
        if(req.body.rdulabel) labels = arr.pruneOne(req.body.rdulabel, labels)
        teacherone.set('labels', labels)
        if(req.body.lat) teacherone.set('lat', Number(req.body.lat))
        if(req.body.lng) teacherone.set('lng', Number(req.body.lng))
        if(imgUrl) {
          newteacher.set('img', imgUrl)
          qcos.deleteKey(imgurl).then()
        } else if(req.body.img) {
          newteacher.set('img', req.body.img)
          qcos.deleteKey(imgurl).then()
        }
        if(req.body.realName) teacherone.set('realName', req.body.realName)
        if(req.body.gender) teacherone.set('gender', Number(req.body.gender))
        if(req.body.introduction) teacherone.set('introduction', req.body.introduction)
        if(req.body.show) teacherone.set('show', show)
        teacherone.save().then((iamteacher)=> {
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: iamteacher })
        })
      })
    })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: err })
  })
})
//teacherone.set('rqcode', req.body.rqcode)

module.exports = router