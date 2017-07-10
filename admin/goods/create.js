const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')
  , qcos = require('../../utils/qcos')

router.post('/images', (req, res)=> {
  const adminId = req.musicadmin.id
  qcos.upload(req, res, 'adminmusic/images').then((imageUrl)=> {
    var queryimage = new AV.Query('Image')
    queryimage.equalTo('adminId', adminId)
    queryimage.find().then((images)=> {
      if(images[0]) {
        var imagesor = images[0].get('images')
        var imgdata = {
          id: imagesor.length + 1,
          url: imageUrl
        }
        imagesor.push(imgdata)
        var updateimage = AV.Object.createWithoutData('Image', images[0].id)
        updateimage.set('images', imagesor)
        updateimage.save().then((updateone)=> {
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: updateone })
        })
      } else {
        var imgdata = {
          id: 1,
          url: imageUrl
        }
        var newimage = new AV.Object('Image')
        newimage.set('adminId', adminId)
        newimage.set('images', [imgdata])
        newimage.save().then((newone)=> {
          res.send({code: msg.postok[0], errMsg: msg.postok[1], data: newone })
        })
      }
    })
  })
})

router.get('/images/empty', (req, res)=> {
  const adminId = req.musicadmin.id
  var queryimage = new AV.Query('Image')
  queryimage.equalTo('adminId', adminId)
  queryimage.find().then((images)=> {
    if(images[0]) {
      var imagesor = images[0].get('images')
      for(var i = 0; i < imagesor.length; i++) {
        qcos.deleteKey(imagesor[i].url)
      }
      var updateimage = AV.Object.createWithoutData('Image', images[0].id)
      updateimage.set('images', [])
      updateimage.save().then((updateone)=> {
        res.send({code: msg.getok[0], errMsg: msg.getok[1], data: updateone })
      })
    } else res.send({code: msg.getok[0], errMsg: msg.postok[1], data: {} })
  })
})

router.post('/', (req, res)=> {
  const adminId = req.musicadmin.id
    , defaultState = req.body.defaultState === true ? true : false
    , showContactway = req.body.showContactway === true ? true : false
    , category = req.body.category
  if(category != 'goods' && category != 'modle') return res.send({code: msg.formatIncorr[0], errMsg: msg.formatIncorr[1], data: `category只能是'goods'或'modle'` })
  var queryimage = new AV.Query('Image')
  queryimage.equalTo('adminId', adminId)
  queryimage.find().then((images)=> {
    var imagesor = []
      , state = '下架'
    if(images[0]) {
      imagesor = images[0].get('images')
    }
    if(defaultState) state = '上架'
    var goods = new AV.Object('Goods')
    goods.set('cover', imagesor[0] || {})
    goods.set('images', imagesor)
    goods.set('title', String(req.body.title))
    goods.set('point', Number(req.body.point))
    goods.set('text', String(req.body.text))
    goods.set('states', state)
    goods.set('category', String(category))
    goods.set('showContactway', showContactway)
    goods.set('contactway', String(req.body.contactway))
    goods.save().then((newgoods)=> {
      if(category == 'modle') {
        var newmodle = new AV.Object('Modle')
        newmodle.set('background', imagesor[0].url)
        newmodle.save().then((modle)=> {
          newgoods.set('modleId', modle.id)
          newgoods.save()
        })
      }
      if(images[0]) {
        var delimage = AV.Object.createWithoutData('Image', images[0].id)
        delimage.destroy()
      }
      res.send({code: msg.postok[0], errMsg: msg.postok[1], data: newgoods })
    })
  })
})

module.exports = router