const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.post('/one', (req, res)=> {
  const goodsId = req.body.goodsId
    , delgoods = req.body.delgoods === true ? true : false
    , showContactway = req.body.showContactway === true ? true : false
    , category = req.body.category
  if(!delgoods && category != 'goods' && category != 'modle') return res.send({code: msg.formatIncorr[0], errMsg: msg.formatIncorr[1], data: `category只能是'goods'或'modle'` })
  var querygoods = new AV.Query('Goods')
  querygoods.get(goodsId).then((goods)=> {
    if(delgoods) {
      var updategoods = AV.Object.createWithoutData('Goods', goods.id)
      updategoods.destroy()
      res.send({code: msg.postok[0], errMsg: msg.postok[1], data: {} })
    } else {
      var states = req.body.state === true ? '上架' : '下架'
      if(req.body.title) goods.set('title', String(req.body.title))
      if(req.body.point) goods.set('point', Number(req.body.point))
      if(req.body.text) goods.set('text', String(req.body.text))
      if(req.body.contactway) goods.set('contactway', String(req.body.contactway))
      if(typeof req.body.state === 'boolean') goods.set('states', states)
      if(typeof req.body.showContactway === 'boolean') goods.set('showContactway', showContactway)
      goods.set('category', String(category))
      goods.save().then((updateone)=> {
        res.send({code: msg.postok[0], errMsg: msg.postok[1], data: updateone })
      })
    }
  })
})

module.exports = router