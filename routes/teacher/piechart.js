const router = require('express').Router()
  , AV = require('leanengine')
  , msg = require('../../utils/msg')

router.get('/integral', (req, res)=> {
  const userId = req.music.userId
  var queryincome = new AV.Query('Cintegral')
  queryincome.equalTo('userId', userId)
  queryincome.equalTo('kind', 'income')
  queryincome.find().then((allincome)=> {
    var incomeSum = 0
      , sum1 = 0
      , sum2 = 0
      , sum3 = 0
      , sum4 = 0
    allincome.forEach((oneincome)=> {
      var vary = oneincome.get('vary') || 0
        , zode = oneincome.get('zode') || 999
      incomeSum += vary
      switch(zode) {
        case 1 : sum1 += vary;break
        case 2 : sum2 += vary;break
        case 3 : sum3 += vary;break
        case 4 : sum4 += vary;break
        default: null
      }
    })
    var chartData = {
      knowledge: `${Math.round((sum1/incomeSum)*1000)/10}%`, 
      salon: `${Math.round((sum2/incomeSum)*1000)/10}%`, 
      sign: `${Math.round((sum3/incomeSum)*1000)/10}%`, 
      other: `${Math.round((sum4/incomeSum)*1000)/10}%`, 
      tatol: incomeSum
    }
    res.send({code: msg.getok[0], errMsg: msg.getok[1], data: chartData })
  })
})

module.exports = router