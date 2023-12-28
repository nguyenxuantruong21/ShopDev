const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authorizationv2 } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')

const router = express.Router()

// create product
router.post('/product', asyncHandler(productController.createProduct))
// handle refreshToken


module.exports = router
