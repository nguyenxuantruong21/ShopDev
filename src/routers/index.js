const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')

const router = express.Router()
// check api key
router.use(apiKey)
// check permission
router.use(permission('0000'))
// auth api
router.use('/v1/api', require('./product/index'))

router.use('/v1/api', require('./access/index'))


module.exports = router
