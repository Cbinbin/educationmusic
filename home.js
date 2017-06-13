const router = require('express').Router()
  , host = require('./utils/host')

router.get('/', (req, res)=> {
  res.send({
    api: host.domain
  })
})

module.exports = router