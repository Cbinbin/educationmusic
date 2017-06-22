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
        var newvideo = new AV.Object('Video')
        newvideo.set('teacher', teacherPot)
        newvideo.set('fileurl', url)
        newvideo.set('title', String(req.body.title))
        newvideo.set('tags', tags)
        newvideo.save().then((videoone)=> {
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

router.get('/all', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
    , queryvideo = new AV.Query('Video')
  queryuser.include('teacher')
  queryuser.get(userId).then((userinfo)=> {
    var teacher = userinfo.get('teacher') || null
      , teacherId = teacher != null ? teacher.id : 'null'
      , teacherPot = AV.Object.createWithoutData('Teacher', teacherId)
    queryvideo.equalTo('teacher', teacherPot)
    queryvideo.find().then((allvideo)=> {
      res.send({code: msg.getok[0], errMsg: msg.getok[1], data: allvideo })
    })
  })
})

router.get('/single', (req, res)=> {
  const userId = req.music.userId
    , videoid = req.query.videoid || 'undefined'
  var queryuser = new AV.Query('Usermusic')
    , queryvideo = new AV.Query('Video')
  queryuser.include('teacher')
  queryuser.get(userId).then((userinfo)=> {
    queryvideo.get(videoid).then((video)=> {
      var teacher = userinfo.get('teacher') || null
        , teacherId = teacher != null ? teacher.id : 'null'
        , videoteacher = video.get('teacher')
      if(teacherId != videoteacher.id) return res.send({code: msg.notYours[0], errMsg: msg.notYours[1], data: 'videoid' })
      res.send({code: msg.getok[0], errMsg: msg.getok[1], data: video })
    }, (err)=> {
      res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'videoid' })
    })
  })
})

router.post('/delone', (req, res)=> {
  const userId = req.music.userId
    , videoId = req.body.videoId || 'undefined'
  var queryuser = new AV.Query('Usermusic')
    , queryvideo = new AV.Query('Video')
  queryuser.include('teacher')
  queryuser.get(userId).then((userinfo)=> {
    queryvideo.get(videoId).then((video)=> {
      var teacher = userinfo.get('teacher') || null
        , teacherId = teacher != null ? teacher.id : 'null'
        , videoteacher = video.get('teacher')
        , delvideo = AV.Object.createWithoutData('Video', video.id)
      if(teacherId != videoteacher.id) return res.send({code: msg.notYours[0], errMsg: msg.notYours[1], data: 'videoId' })
      delvideo.destroy().then(()=> {
        res.send({code: msg.postok[0], errMsg: msg.postok[1], data: 'deleted success' })
      })
    }, (err)=> {
      res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'videoId' })
    })
  })
})

module.exports = router