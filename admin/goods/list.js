const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.get('/', (req, res)=> {
  const stateTF = req.query.state == 'sell' ? true : false
  var per = req.query.per ? Number(req.query.per) : 10
    , page = req.query.page ? Number(req.query.page) : 1
  var querygoods = new AV.Query('Goods')
  if(stateTF) querygoods.equalTo('states', '上架')
  querygoods.limit(per)
  querygoods.skip(per * (page - 1))
  querygoods.descending('createdAt')
  querygoods.find().then((allgoods)=> {
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: allgoods })
  })
})

router.get('/one', (req, res)=> {
  const goodsid = req.query.goodsid
  var querygoods = new AV.Query('Goods')
  querygoods.get(goodsid).then((goods)=> {
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: goods })
  }, (err)=> {
    res.send({code: msg.nothing[0], errMsg: msg.nothing[1], data: err })
  })
})

module.exports = router