const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../utils/msg')

router.post('/change', (req, res)=> {
  const adminId = req.musicadmin.id
  var queryadmin = new AV.Query('Muadmin')
  queryadmin.get(adminId).then((adminmusic)=> {
    var adminName = adminmusic.get('adminName') || null
    var querynandn = new AV.Query('Nandn')
    querynandn.equalTo('who', adminName)
    querynandn.find().then((nandns)=> {
      if(nandns[0]) {
        if(req.body.name) nandns[0].set('name', req.body.name)
        if(req.body.wxNumber) nandns[0].set('wxNumber', req.body.wxNumber)
        nandns[0].save().then((nn)=> {
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: nn })
        })
      } else {
        var newnandn = new AV.Object('Nandn')
        newnandn.set('who', adminName)
        newnandn.set('admin', 'admin')
        newnandn.set('name', req.body.name)
        newnandn.set('wxNumber', req.body.wxNumber)
        newnandn.save().then((nn)=> {
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: nn })
        })
      }
    })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'adminId' })
  })
})

module.exports = router