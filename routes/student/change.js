const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , qcos = require('../../utils/qcos')
  , arrx = require('../../utils/arrx')
  , arr = new arrx

router.post('/', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('student')
  queryuser.get(userId).then((userinfo)=> {
    var studentId = String(userinfo.get('student').id)
      , querystudent = new AV.Query('Student')
    querystudent.get(studentId).then((studentone)=> {
      qcos.upload(req, res, 'music/imgs').then((imgUrl)=> {
        var labels = studentone.get('labels')
          , imgurl = studentone.get('img')
        if(req.body.addlabel) labels = arr.insertOne(req.body.addlabel, labels)
        if(req.body.rdulabel) labels = arr.pruneOne(req.body.rdulabel, labels)
        studentone.set('labels', labels)
        if(imgUrl) {
          studentone.set('img', imgUrl)
          qcos.deleteKey(imgurl).then()
        } else if(req.body.img) {
          studentone.set('img', req.body.img)
          qcos.deleteKey(imgUrl).then()
        } 
        if(req.body.realName) studentone.set('realName', req.body.realName)
        if(req.body.gender) studentone.set('gender', Number(req.body.gender))
        if(req.body.age) studentone.set('age', Number(req.body.age))
        // if(req.body.show) studentone.set('show', show)
        studentone.save().then((iamstudent)=> {
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: iamstudent })
        })
      })
    }, (err)=> {
      res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'studentId' })
    })
  })
})

module.exports = router