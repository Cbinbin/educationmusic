'use strict'
const express = require('express')
  , cors = require('cors')
  , bodyParser = require('body-parser')
  , app = express()

require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const home = require('./home')
const routes = require('./routes')
const admin = require('./admin')
const session = require('./session')

app.use('/', home)
app.use('/music', routes)
app.use('/admin', admin)
app.use('/session', session)

module.exports = app