const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../utils/msg')
  , arrx = require('../utils/arrx')
  , integralChange = require('../funcs/integralChange')
  , arr = new arrx

router.post('/one', (req, res)=> {
  const userId = req.music.userId
    , goodsId = req.body.goodsId
  var queryuser = new AV.Query('Usermusic')
    , querygoods = new AV.Query('Goods')
  queryuser.get(userId).then((user)=> {
    querygoods.get(goodsId).then((goods)=> {
      var integral = user.get('integral')
        , point = goods.get('point') || 0
        , states = goods.get('states')
        , title = goods.get('title') || 'undefined'
        , category = goods.get('category')
      if(states != '上架') return res.send({code: msg.goodsOff[0], errMsg: msg.goodsOff[1], data: '商品已下架' })
      else if(integral < point) return res.send({code: msg.integralNE[0], errMsg: msg.integralNE[1], data: '积分不足' })
      if(category == 'modle') {
        var modleId = goods.get('modleId')
          , salonModles = user.get('salonModles') || []
        if(arr.inToModleId(salonModles, modleId))
          return res.send({code: msg.failed[0], errMsg: msg.failed[1], data: '请在过期后再购买' })
        var modleData = {
          modleId: modleId,
          timestamp: Number(new Date().getTime() + (1*24*60*60*1000))
        }
        salonModles.push(modleData)
        user.set('salonModles', salonModles)
      }
      user.set('integral', Number(integral - point))
      user.save().then((updateuser)=> {
        integralChange(Number(0 - point), updateuser.id, `换购${title}`)
        var goodsPot = AV.Object.createWithoutData('Goods', goods.id)
          , userPot = AV.Object.createWithoutData('Usermusic', updateuser.id)
          , querynandn = new AV.Query('Nandn')
          , newvoucher = new AV.Object('Voucher')
        querynandn.equalTo('admin', 'admin')
        querynandn.descending('createdAt')
        querynandn.find().then((nandns)=> {
          var name = nandns[0].get('name') || ''
            , wxNumber = nandns[0].get('wxNumber') || ''
          newvoucher.set('goods', goodsPot)
          newvoucher.set('status', 'notrading')
          newvoucher.set('name', name)
          newvoucher.set('wxNum', wxNumber)
          newvoucher.set('userId', updateuser.id)
          newvoucher.set('user', userPot)
          newvoucher.set('showContactway', false)
          newvoucher.save().then((voucher)=> {
            res.send({code: msg.postok[0], errMsg: msg.postok[1], data: voucher })
          })
        })
      })
    })
  })
})

router.get('/vouchers', (req, res)=> {
  const userId = req.music.userId
  var queryvoucher = new AV.Query('Voucher')
  queryvoucher.include('goods')
  queryvoucher.equalTo('userId', userId)
  queryvoucher.descending('createdAt')
  queryvoucher.find().then((vouchers)=> {
    var voucheres = []
    vouchers.forEach((onev)=> {
      var goods = onev.get('goods') || null
      voucheres.push({
        goods: {
          title: goods != null ? goods.get('title') : null,
          point: goods != null ? goods.get('point') : null
        },
        status: onev.get('status') || null,
        name: onev.get('name') || null,
        wxNum: onev.get('wxNum') || null,
        showContactway: onev.get('showContactway') || false,
        objectId: onev.id,
        createdAt: onev.createdAt
      })
    })
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: voucheres })
  })
})

module.exports = router