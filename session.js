const router = require('express').Router()
  , request = require('superagent')
  , setinfo = require('./funcs/setinfo')
  , msg = require('./utils/msg')
  , wxApis = require('./utils/wxApis')
  , WXBizDataCrypt = require('./utils/WXBizDataCrypt')
  , check = require('./utils/check')
  , xcxId = process.env.XCXID 
  , xcxSecret = process.env.XCXSECRET
  , checkto = new check

checkto.raw(router)

router.get('/', (req, res)=> {
  const code = String(req.query.code)
    , iv = String(req.query.iv)
    , encryptedData = String(req.query.encryptedData)
  console.log(code, iv, encryptedData)
  if (!code || !iv || !encryptedData) return res.send({code: msg.missQuery[0], errMsg: msg.missQuery[1], data: {} })
  request.get(`${wxApis.session}?appid=${xcxId}&secret=${xcxSecret}&js_code=${code}&grant_type=authorization_code`)
  .end((err, result)=> {
    if(!JSON.parse(result.text).errcode) {
      const sessionKey = JSON.parse(result.text).session_key
      const pc = new WXBizDataCrypt(xcxId, sessionKey)
      const wxInfo = pc.decryptData(encryptedData, iv)
      delete wxInfo.watermark
      // console.log(wxInfo)
      setinfo(wxInfo).then((data)=> {
        res.send({code: msg.getok[0], errMsg: msg.getok[1], data: { token: data.token, types: data.types } })
      })
    } else res.send({code: msg.wxlogin[0], errMsg: msg.wxlogin[1], data: result.text })
  })
})

module.exports = router