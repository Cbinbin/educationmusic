const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , datetime = require('../../utils/datetime')
  , dt = new datetime

router.post('/', (req, res)=> {
  const userId = req.music.userId
    , rhythmSensation = req.body.rhythmSensation == undefined || req.body.rhythmSensation < 0 ? 0 : 
                       (req.body.rhythmSensation > 5 ? 5 : Number(req.body.rhythmSensation))
    , readMusic = req.body.readMusic == undefined || req.body.readMusic < 0 ? 0 : 
                       (req.body.readMusic > 5 ? 5 : Number(req.body.readMusic))
    , proficiency = req.body.proficiency == undefined || req.body.proficiency < 0 ? 0 : 
                       (req.body.proficiency > 5 ? 5 : Number(req.body.proficiency))
    , expressiveForce = req.body.expressiveForce == undefined || req.body.expressiveForce < 0 ? 0 : 
                       (req.body.expressiveForce > 5 ? 5 : Number(req.body.expressiveForce))
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('teacher')
  queryuser.get(userId).then((user)=> {
    var teacher = user.get('teacher')
      , teacherPot = AV.Object.createWithoutData('Teacher', teacher.id)
      , assignment = new AV.Object('Task')
    assignment.set('teacher', teacherPot)
    assignment.set('name', req.body.name)
    assignment.set('gender', Number(req.body.gender))
    assignment.set('classtime', req.body.classtime)
    assignment.set('age', Number(req.body.age))
    assignment.set('rhythmSensation', rhythmSensation)
    assignment.set('readMusic', readMusic)
    assignment.set('proficiency', proficiency)
    assignment.set('expressiveForce', expressiveForce)
    assignment.set('keynote', req.body.keynote)
    assignment.set('schedules', [0, 0, 0, 0, 0, 0, 0])
    assignment.save().then((taskone)=> {
      res.send({code: msg.postok[0], errMsg: msg.postok[1], data: taskone })
    })
  })
})

router.get('/all', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('teacher')
  queryuser.get(userId).then((user)=> {
    var teacher = user.get('teacher')
      , teacherPot = AV.Object.createWithoutData('Teacher', teacher.id)
      , queryassign = new AV.Query('Task')
    queryassign.equalTo('teacher', teacherPot)
    queryassign.descending('createdAt')
    queryassign.find().then((assigns)=> {
      var assignes = []
      assigns.forEach((assign)=> {
        assignes.push({
          teacherId: assign.get('teacher').id || null,
          age: assign.get('age') || null,
          name: assign.get('name') || null,
          classtime: assign.get('classtime') || null,
          gender: assign.get('gender') || 0,
          objectId: assign.id,
          createdAt: assign.createdAt
        })
      })
      res.send({code: msg.getok[0], errMsg: msg.getok[1], data: {task: assignes, taskNum: assignes.length} })
    })
  })
})

router.get('/linechart', (req, res)=> {
  const userId = req.music.userId
    , nowdate = dt.splitDate(new Date())
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('teacher')
  queryuser.get(userId).then((user)=> {
    var teacher = user.get('teacher')
      , teacherPot = AV.Object.createWithoutData('Teacher', teacher.id)
      , queryassign = new AV.Query('Task')
    queryassign.equalTo('teacher', teacherPot)
    queryassign.ascending('createdAt')
    queryassign.find().then((assigns)=> {
      var assignes = []
        , numArr = []
        , stampArr = []
        , keyArr = []
        , chartData = []
      assigns.forEach((assign)=> {
        assignes.push({
          objectId: assign.id,
          createdAt: assign.createdAt,
          timestamp: new Date(assign.createdAt).getTime()
        })
      })
      stampArr = dt.output3monthweekstamp(nowdate.year, nowdate.month)
      for(var k = 0; k < stampArr.length; k++) {
        var weekassignNum = 0
        assignes.forEach((assigne)=> {
          if(stampArr[k][0] <= assigne.timestamp && assigne.timestamp < stampArr[k][1]) weekassignNum += 1
        })
        numArr.push(weekassignNum)
      }
      keyArr = dt.key3month(nowdate.year, nowdate.month)
      for(var l = 0; l < keyArr.length; l++) {
        var oneData = {}
        oneData[keyArr[l]] = numArr[l]
        chartData.push(oneData)
      }
      res.send({code: msg.getok[0], errMsg: msg.getok[1], data: chartData })
    })
  })
})

module.exports = router