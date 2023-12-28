const express = require('express')
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authorization, authorizationv2 } = require('../../auth/authUtils')

const router = express.Router()
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.logIn))

//  authentication
// router.use(authorization)
router.use(authorizationv2)
//  logout
router.post('/shop/logout', asyncHandler(accessController.logOut))
// handle refreshToken
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))


module.exports = router
