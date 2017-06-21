const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , qcos = require('../../utils/qcos')
  , arrx = require('../../utils/arrx')
  , arr = new arrx

router.post('/one', (req, res)=> {
  const userId = req.music.userId
  var queryvideous = new AV.Query('Videous')
    , userPot = AV.Object.createWithoutData('Usermusic', userId)
  queryvideous.equalTo('user', userPot)
  qcos.upload(req, res, 'music/studentVideos').then((videoUrl)=> {
    queryvideous.find().then((videouss)=> {
      if(videouss[0]) {
        var existUrl = videouss[0].get('url')
        videouss[0].set('url', videoUrl)
        videouss[0].save().then((videoup)=> {
          qcos.deleteKey(existUrl)
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: videoup })
        })
      } else {
        var newvideous = new AV.Object('Videous')
        newvideous.set('user', userPot)
        newvideous.set('url', videoUrl)
        newvideous.save().then((videous)=> {
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: videous })
        })
      }
    }, (err)=> {
      res.send({code: msg.failed[0], errMsg: err, data: 'Not found the Class "Videous"' })
    })
  })
})

router.post('/student', (req, res)=> {
  const userId = req.music.userId
    , urlId = req.body.urlId || 'null'
    , tags = req.body.tags === undefined ? [] : req.body.tags
  var queryuser = new AV.Query('Usermusic')
    , queryvideous = new AV.Query('Videous')
    , queryteacher = new AV.Query('Teacher')
  queryuser.include('teacher')
  queryuser.get(userId).then((userinfo)=> {
    queryvideous.get(urlId).then((videous)=> {
      var teacher = userinfo.get('teacher') || null
        , teacherId = teacher != null ? teacher.id : 'null'
        , url = videous.get('url')
      queryteacher.get(teacherId).then((teacherone)=> {
        var teacherPot = AV.Object.createWithoutData('Teacher', teacherone.id)
          , videos = teacherone.get('videos') || []
        var newstyle = new AV.Object('Video')
        newstyle.set('teacher', teacherPot)
        newstyle.set('fileurl', url)
        newstyle.set('title', String(req.body.title))
        newstyle.set('tags', tags)
        newstyle.save().then((videoone)=> {
          var videousPot = AV.Object.createWithoutData('Videous', videous.id)
          videousPot.destroy()
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: videoone })
        })
      }, (err)=> {
        res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: '你不是老师' })
      })
    }, (err)=> {
      res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'urlId' })
    })
  })
})

module.exports = router