const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../utils/msg')
  , integralChange = require('../funcs/integralChange')

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
      if(states != '上架') return res.send({code: msg.goodsOff[0], errMsg: msg.goodsOff[1], data: '商品已下架' })
      else if(integral < point) return res.send({code: msg.integralNE[0], errMsg: msg.integralNE[1], data: '积分不足' })
      user.set('integral', Number(integral - point))
      user.save().then((updateuser)=> {
        integralChange(Number(0 - point), updateuser.id, `换购${title}`)
        var goodsPot = AV.Object.createWithoutData('Goods', goods.id)
          , newvoucher = new AV.Object('Voucher')
        newvoucher.set('goods', goodsPot)
        newvoucher.set('status', 'notrading')
        newvoucher.set('name', '饭饭')
        newvoucher.set('wxNum', '333334')
        newvoucher.set('userId', updateuser.id)
        newvoucher.save().then((voucher)=> {
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: voucher })
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
      var goods = onev.get('goods')
      voucheres.push({
        goods: {
          title: goods.get('title') || null,
          point: goods.get('point') || null
        },
        status: onev.get('status'),
        name: onev.get('name'),
        wxNum: onev.get('wxNum'),
        objectId: onev.id,
        createdAt: onev.createdAt
      })
    })
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: voucheres })
  })
})

module.exports = router