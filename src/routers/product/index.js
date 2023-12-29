const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authorizationv2 } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')

const router = express.Router()

// authentication
router.use(authorizationv2)

// create product
router.post('/product', asyncHandler(productController.createProduct))

// get all list draft
router.get('/product/drafts/all', asyncHandler(productController.getAllDraftForShop))


module.exports = router
