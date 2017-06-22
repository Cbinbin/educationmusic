const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , datetime = require('../../utils/datetime')
  , arrx = require('../../utils/arrx')
  , arr = new arrx
  , dt = new datetime

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
  queryuser.include('student')
  queryuser.get(userId).then((user)=> {
    var student = user.get('student')
      , studentPot = AV.Object.createWithoutData('Student', student.id)
      , querytask = new AV.Query('Task')
    querytask.equalTo('student', studentPot)
    querytask.descending('createdAt')
    querytask.include('teacher')
    querytask.find().then((tasks)=> {
      var taskes = []
      tasks.forEach((task)=> {
        var teacher = task.get('teacher') || null
          , schedules = task.get('schedules') || null
        taskes.push({
          teacherId: teacher != null ? teacher.id : null,
          teacherName: teacher != null ? teacher.get('realName') : null,
          classtime: task.get('classtime') || null,
          finish: schedules.toString() === [1, 1, 1, 1, 1, 1, 1].toString() ? true : false,
          objectId: task.id,
          createdAt: task.createdAt
        })
      })
      res.send({code: msg.getok[0], errMsg: msg.getok[1], data: {task: taskes, taskNum: taskes.length} })
    })
  })
})

router.get('/single', (req, res)=> {
  const userId = req.music.userId
    , taskid = req.query.taskid || 'null'
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('student')
  queryuser.get(userId).then((user)=> {
    var student = user.get('student')
      , querytask = new AV.Query('Task')
    querytask.include('student')
    querytask.include('teacher')
    querytask.get(taskid).then((task)=> {
      var taskstudent = task.get('student') || null
        , teacher = task.get('teacher') || null
      if(!taskstudent || taskstudent.id != student.id) return res.send({code: msg.notYours[0], errMsg: msg.notYours[1], data: 'taskid' })
      var taskre = {
        teacherName: teacher != null ? teacher.get('realName') : null,
        teacherImg: teacher != null ? teacher.get('img') : null,
        classtime: task.get('classtime') || null,
        rhythmSensation: task.get('rhythmSensation') || 1,
        readMusic: task.get('readMusic') || 1,
        proficiency: task.get('proficiency') || 1,
        expressiveForce: task.get('expressiveForce') || 1,
        keynote: task.get('keynote') || null,
        schedules: task.get('schedules'),
        objectId: task.id,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
      res.send({code: msg.getok[0], errMsg: msg.getok[1], data: taskre })
    }, (err)=> {
      res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'taskid' })
    })
  })
})

router.get('/linechart', (req, res)=> {
  const userId = req.music.userId
    , nowdate = dt.splitDate(new Date())
  var queryuser = new AV.Query('Usermusic')
  queryuser.include('student')
  queryuser.get(userId).then((user)=> {
    var student = user.get('student')
      , studentPot = AV.Object.createWithoutData('Student', student.id)
      , querytask = new AV.Query('Task')
    querytask.equalTo('student', studentPot)
    querytask.ascending('createdAt')
    querytask.find().then((tasks)=> {
      var taskes = []
        , numArr = []
        , stampArr = []
        , keyArr = []
        , chartData = []
      tasks.forEach((task)=> {
        taskes.push({
          objectId: task.id,
          createdAt: task.createdAt,
          timestamp: new Date(task.createdAt).getTime()
        })
      })
      stampArr = dt.output3monthweekstamp(nowdate.year, nowdate.month)
      for(var k = 0; k < stampArr.length; k++) {
        var weektaskNum = 0
        taskes.forEach((taske)=> {
          if(stampArr[k][0] <= taske.timestamp && taske.timestamp < stampArr[k][1]) weektaskNum += 1
        })
        numArr.push(weektaskNum)
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