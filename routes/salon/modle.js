const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , arrx = require('../../utils/arrx')
  , arr = new arrx

router.get('/', (req, res)=> {
  const userId = req.music.userId
    , nowtimestamp = new Date().getTime()
  var querymodle = new AV.Query('Modle')
    , queryuser = new AV.Query('Usermusic')
  queryuser.get(userId).then((user)=> {
    querymodle.find().then((modles)=> {
      var salonModles = user.get('salonModles') || []
        , salonModleCC = salonModles
        , myModles = []
      salonModles.forEach((salonModle)=> {
        if(nowtimestamp > salonModle.timestamp) {
          salonModleCC = arr.pruneOneModleId(salonModle, salonModleCC)
        } else {
          modles.forEach((modle)=> {
            if(modle.id == salonModle.modleId) {
              myModles.push({
                objectId: modle.id,
                background: modle.get('background') || null,
                timestamp: salonModle.timestamp
              })
            }
          })
        }
      })
      user.set('salonModles', salonModleCC)
      user.save().then((newuser)=> {
        res.send({code: msg.getok[0], errMsg: msg.getok[1], data: myModles })
      })
    })
  })
})

module.exports = router