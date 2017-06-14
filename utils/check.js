const jsSHA = require('jssha')
  , jwt = require('jsonwebtoken')
  , AV = require('leanengine')
  , msg = require('./msg')
  , raw = process.env.MUSICRAW
  , salt = process.env.MUSICSALT
  , adsalt = process.env.MUSICADMINSALT

class check {
  
  raw(router) {
    router.use('*', (req, res, next) => {
      var encryptedRaw = req.query.raw 
        , shaObj = new jsSHA('SHA-1', 'TEXT')
      shaObj.update(raw)
      if(shaObj.getHash('HEX') === encryptedRaw) next()
      else res.send({code: msg.checkraw[0], errMsg: msg.checkraw[1], data: {} })
    })
  }

  token(router) {
    router.use('*', (req, res, next) => {
      var token = req.query.token
      jwt.verify(token, salt, (err, decoded) => {
        if (!err) { 
          var queryuser = new AV.Query('Usermusic')
          queryuser.get(decoded.userId).then((user)=> {
            req.music = decoded
            next()
          }, (error)=> {
            res.send({code: msg.checkuserId[0], errMsg: msg.checkuserId[1], data: error })
          })
        } else res.send({code: msg.checktoken[0], errMsg: msg.checktoken[1], data: {} })
      })
    })
  }

  adminToken(router) {
    router.use('*', (req, res, next) => {
      var token = req.query.token
      jwt.verify(token, adsalt, (err, decoded) => {
        if (!err) { 
          req.musicadmin = decoded.objParam
          next()
        } else res.send({code: msg.checktoken[0], errMsg: msg.checktoken[1], data: {} })
      })
    })
  }

}

module.exports = check