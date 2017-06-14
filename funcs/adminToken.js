const jwt = require('jsonwebtoken')
  , adsalt = process.env.MUSICADMINSALT

function adminToken(objParam) {
  var jwttoken = new Promise((resolve, reject)=> {
    jwt.sign({objParam: objParam}, 
    adsalt, 
    {expiresIn: '3d'}, 
    (err, token)=> {
      if(err) return reject(err)
      resolve(token)
    })
  })
  return jwttoken
}

module.exports = adminToken