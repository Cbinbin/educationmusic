const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , arrx = require('../../utils/arrx')
  , arr = new arrx

router.post('/receive', (req, res)=> {
  const userId = req.music.userId
    , taskId = req.body.taskId
  var queryuser = new AV.Query('Usermusic')
    , querytask = new AV.Query('Task')
  queryuser.include('student')
  querytask.include('teacher')
  queryuser.get(userId).then((user)=> {
    querytask.get(taskId).then((task)=> {
      var student = user.get('student') || null
        , teacher = task.get('teacher') || null
        , myStudent = teacher.get('myStudent')
        , assignments = teacher.get('assignments')
      if(student) {
        var myTeacher = student.get('myTeacher')
          , tasks = student.get('tasks')
        var studentPot = AV.Object.createWithoutData('Student', student.id)
          , teacherPot = AV.Object.createWithoutData('Teacher', teacher.id)
        task.set('student', studentPot)
        task.save().then((taskone)=> {
          var taskPot = AV.Object.createWithoutData('Task', taskone.id)
          arr.insertOnePot(teacherPot, myTeacher)
          arr.insertOnePot(taskPot, tasks)
          arr.insertOnePot(studentPot, myStudent)
          arr.insertOnePot(taskPot, assignments)
          studentPot.set('myTeacher', myTeacher)
          studentPot.set('tasks', tasks)
          teacherPot.set('myStudent', myStudent)
          teacherPot.set('assignments', assignments)
          studentPot.save()
          teacherPot.save()
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: taskone })
        })
      } else res.send({code: msg.failed[0], errMsg: msg.failed[1], data: '你不是学生' })
    }, (err)=> {
      res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'taskId' })
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
          createdAt: assign.createdAt,
        })
      })
      res.send({code: msg.getok[0], errMsg: msg.getok[1], data: {task: assignes, taskNum: assignes.length} })
    })
  })
})

module.exports = router