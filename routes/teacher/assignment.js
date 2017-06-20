const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.post('/', (req, res)=> {
  const userId = req.music.userId
    , studentId = req.body.studentId
    , rhythmSensation = req.body.rhythmSensation <= 0 ? 0 : (req.body.rhythmSensation > 5 ? 5 : Number(req.body.rhythmSensation))
    , readMusic = req.body.readMusic <= 0 ? 0 : (req.body.readMusic > 5 ? 5 : Number(req.body.readMusic))
    , proficiency = req.body.proficiency <= 0 ? 0 : (req.body.proficiency > 5 ? 5 : Number(req.body.proficiency))
    , expressiveForce = req.body.expressiveForce <= 0 ? 0 : (req.body.expressiveForce > 5 ? 5 : Number(req.body.expressiveForce))
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('teacher')
  queryuser.get(userId).then((user)=> {
    var teacher = user.get('teacher')
      , teacherPot = AV.Object.createWithoutData('Teacher', teacher.id)
      , studentPot = AV.Object.createWithoutData('Student', studentId)
      , assignment = new AV.Object('Task')
    assignment.set('teacher', teacherPot)
    assignment.set('student', studentPot)
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
    res.send({code: msg.postok[0], errMsg: msg.postok[1], data: '' })
  })
})

module.exports = router