const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , arrx = require('../../utils/arrx')
  , getDistance = require('../../utils/getDistance')
  , arr = new arrx

router.get('/', (req, res)=> {
  const userId = req.music.userId
  var queryuser = new AV.Query('Usermusic')
    , querytask = new AV.Query('Task')
  queryuser.include('student')
  queryuser.get(userId).then((user)=> {
    var student = user.get('student') || null
      , studentPot = AV.Object.createWithoutData('Student', student.id)
      , querystudent = new AV.Query('Student')
    if(!student) return res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: '你不是学生' })
    querystudent.include('myTeacher')
    querytask.equalTo('student', studentPot)
    querystudent.get(student.id).then((iamstudent)=> {
      querytask.find().then((mytasks)=> {
        var myTeacher = iamstudent.get('myTeacher')
          , myteacherArr = []
        myTeacher.forEach((teacherone)=> {
          var taskNum = 0
          if(teacherone) {
            mytasks.forEach((taskone)=> {
              if(taskone.get('teacher').id == teacherone.id) taskNum += 1
            })
            myteacherArr.push({
              realName: teacherone.get('realName') || null,
              img: teacherone.get('img') || null,
              gender: teacherone.get('gender') || 0,
              instrument: teacherone.get('instrument') || null,
              labels: teacherone.get('labels') || [],
              introduction: teacherone.get('introduction') || null,
              objectId: teacherone.id,
              createdAt: teacherone.createdAt,
              taskNum: taskNum
            })
          }
        })
        res.send({code: msg.getok[0], errMsg: msg.getok[1], data: myteacherArr })
      })
    })
  })
})

router.get('/recommend', (req, res)=> {
  const userId = req.music.userId
    , lat = req.query.lat ? Number(req.query.lat) : 0
    , lng = req.query.lng ? Number(req.query.lng) : 0
  var queryteacher = new AV.Query('Teacher')
  queryteacher.equalTo('show', true)
  queryteacher.find().then((allteacher)=> {
    var teachers = []
    allteacher.forEach((one)=> {
      var onelat = one.get('lat') || 1
        , onelng = one.get('lng') || 1
        , introduction = one.get('introduction') || ''
        , introductionLength = introduction.split('').length
      if(introductionLength >= 20) {
        teachers.push({
          distanceNum: getDistance(lat, lng, onelat, onelng),
          distance: getDistance(lat, lng, onelat, onelng) >= 1000 ? `${Math.round(getDistance(lat, lng, onelat, onelng)/10)/100} km` : `${getDistance(lat, lng, onelat, onelng)} m`,
          gender: one.get('gender') || 0,
          introduction: one.get('introduction') || null,
          realName: one.get('realName') || null,
          img: one.get('img') || null,
          instrument: one.get('instrument') || null,
          objectId: one.id,
          createdAt: one.createdAt
        })
      }
    })
    teachers.sort((a, b)=> {
      return a.distanceNum - b.distanceNum
    })
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: teachers })
  })
})

router.post('/recommend/search', (req, res)=> {
  const search = req.body.search
  var queryteacher = new AV.Query('Teacher')
  queryteacher.find().then((allteacher)=> {
    var searchword = search != undefined ? search.split('') : []
      , allword = []
    allteacher.forEach((one)=> {
      var instrument = one.get('instrument').split('')
      allword.push(instrument[0])
    })
    if(arr.inTo(allword, searchword[0])) {
      //按乐器查找
      var queryinstru = new AV.Query('Teacher')
        , regExpi = new RegExp(`^${search}`, 'i')
      queryinstru.matches('instrument', regExpi)
      queryinstru.find().then((teachers)=> {
        res.send({code: msg.postok[0], errMsg: msg.postok[1], data: teachers })
      })
    } else {
      //按名字查找
      var queryname = new AV.Query('Teacher')
        , regExpr = new RegExp(`^${search}`, 'i')
      queryname.matches('realName', regExpr)
      queryname.find().then((teachers)=> {
        res.send({code: msg.postok[0], errMsg: msg.postok[1], data: teachers })
      })
    }
  })
})

router.get('/one/detail', (req, res)=> {
  const teacherid = req.query.teacherid
  var queryteacher = new AV.Query('Teacher')
  queryteacher.get(teacherid).then((teacher)=> {
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: teacher })
  })
})

module.exports = router