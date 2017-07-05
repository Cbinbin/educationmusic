const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , arrx = require('../../utils/arrx')
  , salonFormat = require('../salon/functions/salonFormat')
  , arr = new arrx

router.post('/collect', (req, res)=> {
  const userId = req.music.userId
    , salonId = req.body.salonId || 'undefined'
  var queryuser = new AV.Query('Usermusic')
    , querystudent = new AV.Query('Student')
    , querysalon = new AV.Query('Salon')
  queryuser.include('student')
  queryuser.get(userId).then((user)=> {
    querysalon.get(salonId).then((shalong)=> {
      var student = user.get('student') || null
        , shalongPot = AV.Object.createWithoutData('Salon', shalong.id) || {id: salonId}
      if(!student) return res.send({code: msg.failed[0], errMsg: msg.failed[1], data: '你不是学生' })
      querystudent.get(student.id).then((iamstudent)=> {
        var shalongIds = iamstudent.get('shalongIds') || []
          , successText = ''
        if(arr.inToPot(shalongIds, shalongPot)) {
          shalongIds = arr.pruneOnePot(shalongPot, shalongIds)
          successText = '取消收藏'
        } else {
          shalongIds = arr.insertOnePot(shalongPot, shalongIds)
          successText = '成功收藏'
        }
        iamstudent.set('shalongIds', shalongIds)
        iamstudent.save().then((upstudent)=> {
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: successText })
        })
      })
    }, (err)=> {
      res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'salonId' })
    })
  })
})

router.post('/cancel', (req, res)=> {
  const userId = req.music.userId
    , salonId = req.body.salonId
  var queryuser = new AV.Query('Usermusic')
    , querystudent = new AV.Query('Student')
    , querysalon = new AV.Query('Salon')
  queryuser.include('student')
  queryuser.get(userId).then((user)=> {
    var student = user.get('student') || null
      , shalongPot = {id: salonId}
    if(!student) return res.send({code: msg.failed[0], errMsg: msg.failed[1], data: '你不是学生' })
    querystudent.get(student.id).then((iamstudent)=> {
      var shalongIds = iamstudent.get('shalongIds') || []
      shalongIds = arr.pruneOnePot(shalongPot, shalongIds)
      iamstudent.set('shalongIds', shalongIds)
      iamstudent.save().then((upstudent)=> {
        res.send({code: msg.postok[0], errMsg: msg.postok[1], data: '取消收藏' })
      })
    })
  })
})

router.get('/mycollects', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
    , querystudent = new AV.Query('Student')
  queryuser.include('student')
  queryuser.get(userId).then((user)=> {
    var student = user.get('student') || null
    if(!student) return res.send({code: msg.failed[0], errMsg: msg.failed[1], data: '你不是学生' })
    querystudent.get(student.id).then((iamstudent)=> {
      var shalongIds = iamstudent.get('shalongIds') || []
        , queryall = null
        , shalongs = []
      shalongIds.forEach((shalongId)=> {
        var querysalon = new AV.Query('Salon')
        querysalon.equalTo('objectId', shalongId.id)
        if(!queryall) queryall = AV.Query.or(querysalon)
        else queryall = AV.Query.or(querysalon, queryall)
      })
      if(!queryall) return res.send({code: msg.getok[0], errMsg: msg.getok[1], data: [] })
      queryall.include('user')
      queryall.include('user.teacher')
      queryall.find().then((allshalong)=> {
        allshalong.forEach((salon)=> {
          var salonone = salonFormat(salon)
          salonone.collected = true
          shalongs.push(salonone)
        })
        res.send({code: msg.getok[0], errMsg: msg.getok[1], data: shalongs })
      })
    })
  })
})

router.get('/all', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
    , querystudent = new AV.Query('Student')
    , querysalon = new AV.Query('Salon')
  queryuser.include('student')
  queryuser.get(userId).then((user)=> {
    var student = user.get('student') || null
    if(!student) return res.send({code: msg.failed[0], errMsg: msg.failed[1], data: '你不是学生' })
    querysalon.include('user')
    querysalon.include('user.teacher')
    querysalon.descending('createdAt')
    querysalon.find().then((allshalong)=> {
      querystudent.get(student.id).then((iamstudent)=> {
        var shalongIds = iamstudent.get('shalongIds') || []
          , shalongs = []
        allshalong.forEach((shalong)=> {
          var collected = false
            , salonone = salonFormat(shalong)
          shalongIds.forEach((shalongId)=> {
            if(shalong.id == shalongId.id) collected = true
          })
          salonone.collected = collected
          shalongs.push(salonone)
        })
        res.send({code: msg.getok[0], errMsg: msg.getok[1], data: shalongs })
      })
    })
  })
})

router.get('/one/detail', (req, res)=> {
  const userId = req.music.userId
  const salonid = req.query.salonid || 'undefined'
  var queryuser = new AV.Query('Usermusic')
    , querysalon = new AV.Query('Salon')
  querysalon.include('user')
  querysalon.include('user.teacher')
  queryuser.include('student')
  queryuser.include('student.shalongIds')
  queryuser.get(userId).then((user)=> {
    querysalon.get(salonid).then((salon)=> {
      var student = user.get('student') || null
      if(!student) return res.send({code: msg.failed[0], errMsg: msg.failed[1], data: '你不是学生' })
      var shalongIds = student.get('shalongIds') || []
        , salonre = salonFormat(salon)
      if(arr.inToPot(shalongIds, salon)) salonre.collected = true
      else salonre.collected = false
      if(salonre.modle) {
        var querymodle = new AV.Query('Modle')
        querymodle.get(salonre.modle).then((modleone)=> {
          salonre.modle = {
            objectId: modleone.id,
            background: modleone.get('background')
          }
          res.send({code: msg.getok[0], errMsg: msg.getok[1], data: salonre })
        })
      } else res.send({code: msg.getok[0], errMsg: msg.getok[1], data: salonre })
    }, (err)=> {
      res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'salonid' })
    })
  })
})

module.exports = router