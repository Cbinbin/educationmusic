const jwt = require('jsonwebtoken')
  , AV = require('leanengine')
  , salt = process.env.MUSICSALT

function jwtSign(obj) {
  var jwttoken = new Promise((resolve, reject)=> {
    jwt.sign({userOpenId: obj.openId, userId: obj.objectId}, 
    salt, 
    {expiresIn: '10d'}, 
    (err, token)=> {
      if(err) return reject(err)
      resolve(token)
    })
  })
  return jwttoken
}

function setinfo(info) {
  var musictoken = new Promise((resolve, reject)=> {
    var query = new AV.Query('Usermusic')
    query.equalTo('openId', info.openId)
    query.find().then((exist)=> {
      if(exist[0]) {
        var objData = {
          openId: exist[0].get('openId'),
          objectId: exist[0].get('objectId')
        }
        var types = exist[0].get('types') || null
        jwtSign(objData).then((token)=> {
          var data = {
            token: token,
            types: types
          }
          resolve(data)
        })
      } else {
        var muser = new AV.Object('Usermusic')
        muser.set('openId', info.openId)
        muser.set('nickName', info.nickName)
        muser.set('avatarUrl', info.avatarUrl)
        muser.set('gender', info.gender)
        muser.set('province', info.province)
        muser.set('city', info.city)
        muser.set('integral', 0)
        muser.set('salonModles', [])
        muser.save().then((newuser)=> {
          var objData = {
            openId: newuser.get('openId'),
            objectId: newuser.get('objectId')
          }
          jwtSign(objData).then((token)=> {
            var data = {
              token: token,
              types: null
            }
            resolve(data)
          })
        })
      }
    }, (error)=> {
      var muser = new AV.Object('Usermusic')
      muser.set('openId', info.openId)
      muser.set('nickName', info.nickName)
      muser.set('avatarUrl', info.avatarUrl)
      muser.set('gender', info.gender)
      muser.set('province', info.province)
      muser.set('city', info.city)
      muser.set('integral', 0)
      muser.set('salonModles', [])
      muser.save().then((newuser)=> {
        var objData = {
          openId: newuser.get('openId'),
          objectId: newuser.get('objectId')
        }
        jwtSign(objData).then((token)=> {
          var data = {
            token: token,
            types: null
          }
          resolve(data)
        })
      })
    })
  })
  return musictoken
}

module.exports = setinfo