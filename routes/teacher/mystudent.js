const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , arrx = require('../../utils/arrx')
  , arr = new arrx

router.get('/', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
    , querytask = new AV.Query('Task')
  queryuser.include('teacher')
  queryuser.get(userId).then((user)=> {
    var teacher = user.get('teacher')
      , teacherPot = AV.Object.createWithoutData('Teacher', teacher.id)
      , queryteacher = new AV.Query('Teacher')
    if(!teacher) return res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: '你不是教师' })
    queryteacher.include('myStudent')
    querytask.equalTo('teacher', teacherPot)
    queryteacher.get(teacher.id).then((iamteacher)=> {
      querytask.find().then((myassignments)=> {
        var myStudent = iamteacher.get('myStudent')
          , mystudentArr = []
        myStudent.forEach((studentone)=> {
          var taskNum = 0
            , percent = 0
          myassignments.forEach((assignmentone)=> {
            var assignstudent = assignmentone.get('student') || null
              , schedules = assignmentone.get('schedules') || [0, 0, 0, 0, 0, 0, 0]
            if(assignstudent != null && assignstudent.id == studentone.id) {
              taskNum += 1
              percent += arr.numSum(schedules)/schedules.length
            }
          })
          mystudentArr.push({
            realName: studentone.get('realName') || null,
            img: studentone.get('img') || null,
            gender: studentone.get('gender') || 0,
            age: studentone.get('age') || 0,
            labels: studentone.get('labels') || [],
            objectId: studentone.id,
            createdAt: studentone.createdAt,
            taskNum: taskNum,
            percent: Math.round((percent/taskNum) * 100)
          })
        })
        res.send({code: msg.getok[0], errMsg: msg.getok[1], data: mystudentArr })
      })
    })
  })
})

module.exports = router