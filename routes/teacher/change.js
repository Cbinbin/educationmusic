const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , qcos = require('../../utils/qcos')
  , arrx = require('../../utils/arrx')
  , integralChange = require('../../funcs/integralChange')
  , arr = new arrx

router.post('/', (req, res)=> {
  const userId = req.music.userId
    , show = req.body.show === true ? true : false
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('teacher')
  queryuser.get(userId).then((userinfo)=> {
    var teacherId = String(userinfo.get('teacher').id)
      , queryteacher = new AV.Query('Teacher')
    queryteacher.get(teacherId).then((teacherone)=> {
      qcos.upload(req, res, 'music/imgs').then((imgUrl)=> {
        var labels = teacherone.get('labels')
          , imgurl = teacherone.get('img')
        if(req.body.addlabel) labels = arr.insertOne(req.body.addlabel, labels)
        if(req.body.rdulabel) labels = arr.pruneOne(req.body.rdulabel, labels)
        if(labels.length > 3) return res.send({code: msg.failed[0], errMsg: msg.failed[1], data: 'labels长度不能大于三个' })
        teacherone.set('labels', labels)
        if(req.body.lat) teacherone.set('lat', Number(req.body.lat))
        if(req.body.lng) teacherone.set('lng', Number(req.body.lng))
        if(imgUrl) {
          teacherone.set('img', imgUrl)
          qcos.deleteKey(imgurl).then()
        } else if(req.body.img) {
          teacherone.set('img', req.body.img)
          qcos.deleteKey(imgUrl).then()
        } 
        if(req.body.realName) teacherone.set('realName', req.body.realName)
        if(req.body.gender) teacherone.set('gender', Number(req.body.gender))
        if(req.body.instrument) teacherone.set('instrument', req.body.instrument)
        if(req.body.introduction) teacherone.set('introduction', req.body.introduction)
        if(req.body.show) teacherone.set('show', show)
        teacherone.save().then((iamteacher)=> {
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: iamteacher })
        })
      })
    }, (err)=> {
      res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'teacherId' })
    })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'userId' })
  })
})

router.post('/rqcode', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('teacher')
  queryuser.get(userId).then((userinfo)=> {
    var teacherId = String(userinfo.get('teacher').id)
      , queryteacher = new AV.Query('Teacher')
    queryteacher.get(teacherId).then((teacherone)=> {
      var codeurl = teacherone.get('rqcode') || null
      qcos.upload(req, res, 'music/rqcodes').then((rqcodeUrl)=> {
        if(codeurl) qcos.deleteKey(codeurl).then()
        if(rqcodeUrl) {
          teacherone.set('rqcode', rqcodeUrl)
          if(!codeurl) {
            var integral = userinfo.get('integral')
            integralChange(10, userinfo.id, '信息完善-二维码')
            userinfo.set('integral', (integral + 10))
            userinfo.save()
          }
        }
        teacherone.save().then((iamteacher)=> {
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: iamteacher })
        })
      })
    }, (err)=> {
      res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'teacherId' })
    })
  })
})

router.post('/cert', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('teacher')
  queryuser.get(userId).then((userinfo)=> {
    var teacherId = String(userinfo.get('teacher').id)
      , queryteacher = new AV.Query('Teacher')
    queryteacher.get(teacherId).then((teacherone)=> {
      var certs = teacherone.get('certs') || []
        , certlength = certs.length
        , certjudge = teacherone.get('certjudge') || false
      qcos.upload(req, res, 'music/certs').then((certUrl)=> {
        var rducertUrl = req.body.rducertUrl
        arr.pruneOne(rducertUrl, certs)
        if(certs.length != certlength) qcos.deleteKey(rducertUrl).then()
        if(certUrl) {
          certs = arr.insertOne(certUrl, certs)
          teacherone.set('certs', certs)
          teacherone.set('certjudge', true)
          if(!certjudge) {
            var integral = userinfo.get('integral')
            integralChange(10, userinfo.id, '信息完善-证书')
            userinfo.set('integral', (integral + 10))
            userinfo.save()
          }
        }
        teacherone.save().then((iamteacher)=> {
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: iamteacher })
        })
      })
    }, (err)=> {
      res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'teacherId' })
    })
  })
})

router.post('/style', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('teacher')
  queryuser.get(userId).then((userinfo)=> {
    var teacherId = String(userinfo.get('teacher').id)
      , queryteacher = new AV.Query('Teacher')
    queryteacher.get(teacherId).then((teacherone)=> {
      var videos = teacherone.get('videos')
        , videolength = videos.length
        , videojudge = teacherone.get('videojudge') || false
      qcos.upload(req, res, 'music/videos').then((videoUrl)=> {
        var rduvideoUrl = req.body.rduvideoUrl
        arr.pruneOne(rduvideoUrl, videos)
        if(videos.length != videolength) qcos.deleteKey(rduvideoUrl).then()
        if(videoUrl) {
          videos = arr.insertOne(videoUrl, videos)
          teacherone.set('videos', videos)
          teacherone.set('videojudge', true)
          if(!videojudge) {
            var integral = userinfo.get('integral')
            integralChange(10, userinfo.id, '信息完善-教学风采')
            userinfo.set('integral', (integral + 10))
            userinfo.save()
          }
        }
        teacherone.save().then((iamteacher)=> {
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: iamteacher })
        })
      })
    }, (err)=> {
      res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'teacherId' })
    })
  })
})

module.exports = router