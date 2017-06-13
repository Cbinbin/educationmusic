var crypto = require('crypto')

class WXBizDataCrypt{
  constructor(appId, sessionKey) {
    this.appId = appId
    this.sessionKey = sessionKey
  }

  decryptData(encryptedData, iv) {
    var sessionKey = new Buffer(this.sessionKey, 'base64')
    encryptedData = new Buffer(encryptedData, 'base64')
    iv = new Buffer(iv, 'base64')
    try {
      var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
      decipher.setAutoPadding(true)
      var decoded = decipher.update(encryptedData, 'binary', 'utf8')
      decoded += decipher.final('utf8')
      decoded = JSON.parse(decoded)
    } catch (err) {
      throw new Error(err)
    }
    if (decoded.watermark.appid !== this.appId) {
      throw new Error('Illegal Buffer')
    }
    return decoded
  }
}

module.exports = WXBizDataCrypt
