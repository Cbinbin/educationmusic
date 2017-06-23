const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../utils/msg')
  , arrx = require('../utils/arrx')
  , arr = new arrx

router.post('/', (req, res)=> {
  const userId = req.music.userId
    , relieve = req.body.relieve
  if(relieve != 'teacher' && relieve != 'student') return res.send({code: msg.typeExist[0], errMsg: msg.typeExist[1], data: `relieve只能为'teacher'或'student'` })
  var queryuser = new AV.Query('Usermusic')
  queryuser.get(userId).then((user)=> {
    var types = user.get('types') || null
      , identity = types == 'teacher' ? user.get('teacher') : 
                  (types == 'student' ? user.get('student') : null)
    if(types != relieve) return res.send({code: msg.failed[0], errMsg: msg.failed[1], data: '解除的身份和你的不同' })
    if(types == 'teacher') {//教师端//
      var queryidentity = new AV.Query('Teacher')
      queryidentity.get(identity.id).then((teacher)=> {
        var myStudent = teacher.get('myStudent')
          , querystudent = new AV.Query('Student')
          , querytask = new AV.Query('Task')
          , delteacher = AV.Object.createWithoutData('Teacher', teacher.id)
        myStudent.forEach((astudent)=> {    //删掉学生里的老师
          querystudent.get(astudent.id).then((anone)=> {
            var oneTeachers = anone.get('myTeacher') || []
            oneTeachers = arr.pruneOnePot(identity, oneTeachers)
            anone.set('myTeacher', oneTeachers)
            anone.save()
          })
        })
        querytask.equalTo('teacher', identity)
        querytask.include('student')
        querytask.find().then((sometasks)=> {
          sometasks.forEach((task)=> {    //删掉没有学生接收的任务
            var studentEx = task.get('student') || null
            if(!studentEx) {
              var deltask = AV.Object.createWithoutData('Task', task.id)
              deltask.destroy()
            } else {
              task.set('teacher', null)
              task.save()
            }
          })
          delteacher.destroy()    //删掉老师数据
          user.set('types', 'undefined')
          user.set('teacher', null)
          user.save().then((updateuser)=> {
            res.send({code: msg.postok[0], errMsg: msg.postok[1], data: 'relieved success' })
          })
        })
      })

    } else if(types == 'student') {//学生端//
      var queryidentity = new AV.Query('Student')
      queryidentity.get(identity.id).then((student)=> {
        var myTeacher = student.get('myTeacher')
          , queryteacher = new AV.Query('Teacher')
          , querytask = new AV.Query('Task')
          , delstudent = AV.Object.createWithoutData('Student', student.id)
        myTeacher.forEach((ateacher)=> {    //删掉老师里的学生
          queryteacher.get(ateacher.id).then((anone)=> {
            var oneStudents = anone.get('myStudent') || []
            oneStudents = arr.pruneOnePot(identity, oneStudents)
            anone.set('myStudent', oneStudents)
            anone.save()
          })
        })
        querytask.equalTo('student', identity)
        querytask.include('teacher')
        querytask.find().then((sometasks)=> {
          sometasks.forEach((task)=> {    //删掉没有指向老师的任务
            var teacherEx = task.get('teacher') || null
            if(!teacherEx) {
              var deltask = AV.Object.createWithoutData('Task', task.id)
              deltask.destroy()
            } else {
              task.set('student', null)
              task.save()
            }
          })
          delstudent.destroy()    //删掉学生数据
          user.set('types', 'undefined')
          user.set('student', null)
          user.save().then((updateuser)=> {
            res.send({code: msg.postok[0], errMsg: msg.postok[1], data: 'relieved success' })
          })
        })
      })
    }
  })
})

module.exports = router