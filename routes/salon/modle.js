const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.get('/', (req, res)=> {
  const userId = req.music.userId
  var querymodle = new AV.Query('Modle')
    , queryuser = new AV.Query('Usermusic')
  queryuser.get(userId).then((user)=> {
    querymodle.find().then((modles)=> {
      var salonModles = user.get('salonModles')
        , myModles = []
      salonModles.map((salonModle)=> {
        modles.forEach((modle)=> {
          if(modle.id == salonModle.modleId) {
            myModles.push({
              objectId: modle.id,
              background: modle.get('background') || null,
              timestamp: salonModle.timestamp
            })
          }
        })
      })
      res.send({code: msg.getok[0], errMsg: msg.getok[1], data: myModles })
    })
  })
})

module.exports = router