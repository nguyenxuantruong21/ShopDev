const express = require('express')
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authorization } = require('../../auth/authUtils')

const router = express.Router()
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.logIn))
//  authentication
router.use(authorization)
//  logout
router.post('/shop/logout', asyncHandler(accessController.logOut))



module.exports = router
