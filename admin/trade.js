const router = require('express').Router()
  , AV = require('leanengine')
  , moment = require('moment')
  , msg = require('../utils/msg')

router.get('/all', (req, res)=> {
  var queryvoucher = new AV.Query('Voucher')
  queryvoucher.include('goods')
  queryvoucher.include('user')
  queryvoucher.include('user.teacher')
  queryvoucher.include('user.student')
  queryvoucher.find().then((vouchers)=> {
    var voucheres = []
    vouchers.forEach((voucher)=> {
      var goods = voucher.get('goods') || null
        , user = voucher.get('user') || null
        , types = user != null ? user.get('types') : null
        , identity = types == 'teacher' ? user.get('teacher') : 
                    (types == 'student' ? user.get('student') : null)
      voucheres.push({
        goods: {
          title: goods != null ? goods.get('title') : null,
          cover: goods != null ? goods.get('cover').url : null,
          point: goods != null ? goods.get('point') : 0
        },
        user: {
          name: identity != null ? identity.get('realName') : null,
          img: identity != null ? identity.get('img') : null
        },
        admin: {
          adname: voucher.get('name') || null,
          wxNum: voucher.get('wxNum') || null
        },
        status: voucher.get('status') || null,
        showContactway: voucher.get('showContactway') || false,
        contactway: voucher.get('contactway') || null,
        objectId: voucher.id,
        createdAt: moment(voucher.createdAt).format('YYYY-MM-DD hh:mm:ss'),
        updatedAt: moment(voucher.updatedAt).format('YYYY-MM-DD hh:mm:ss')
      })
    })
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: voucheres })
  })
})

router.post('/status', (req, res)=> {
  const adminId = req.musicadmin.id
    , voucherId = req.body.voucherId
    , showContactway = req.body.showContactway === true ? true : false
  var queryvoucher = new AV.Query('Voucher')
  queryvoucher.get(voucherId).then((voucherone)=> {
    if(req.body.showContactway !== undefined) voucherone.set('showContactway', showContactway)
    voucherone.save().then((voucherup)=> {
      res.send({code: msg.postok[0], errMsg: msg.postok[1], data: voucherup })
    })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'voucherId' })
  })
})

router.post('/del', (req, res)=> {
  const adminId = req.musicadmin.id
  const voucherId = req.body.voucherId || 'null'
  var queryvoucher = new AV.Query('Voucher')
  queryvoucher.get(voucherId).then((voucher)=> {
    var delvoucher = AV.Object.createWithoutData('Voucher', voucher.id)
    delvoucher.destroy().then(()=> {
      res.send({code: msg.postok[0], errMsg: msg.postok[1], data: 'deleted success' })
    })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: 'voucherId' })
  })
})

module.exports = router