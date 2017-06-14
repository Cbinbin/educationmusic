const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('./utils/msg')
  , adminToken = require('./funcs/adminToken')

router.post('/', (req, res)=> {
  const adminName = req.body.adminName
    , passWord = req.body.passWord
  var queryadmin = new AV.Query('Muadmin')
  queryadmin.equalTo('adminName', adminName)
  queryadmin.find().then((one)=> {
    if(one[0]) {
      var pw = one[0].get('passWord')
      if(passWord === pw) {
        var obj = {
          id: one[0].id,
          name: adminName
        }
        adminToken(obj).then((token)=> {
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: token })
        })
      } else res.send({code: msg.passErr[0], errMsg: msg.passErr[1], data: '密码错误' })
    } else {
      res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: adminName })
    }
  })
})

module.exports = router