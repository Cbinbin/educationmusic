'use strict'
const AV = require('leanengine')

const PORT = parseInt(process.env.LEANCLOUD_APP_PORT || 4000)
const app = require('./app')

AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
})
AV.Promise._isPromisesAPlusCompliant = false
// AV.Cloud.useMasterKey()
app.enable('trust proxy')
app.use(AV.express())
app.use(AV.Cloud.HttpsRedirect())

app.listen(PORT, ()=> {
  console.log('Node app is running, port:', PORT)
})