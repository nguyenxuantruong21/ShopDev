const express = require('express')
const { apiKey, permissions } = require('../auth/checkAuth')
const router = express.Router()

// check api key
router.use(apiKey)
// check permission
router.use(permissions['0000'])
// call api
router.use('/v1/api', require('./access'))

module.exports = router
