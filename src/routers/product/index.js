const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authorizationv2 } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')

const router = express.Router()

// search product
router.get('/product/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('/product', asyncHandler(productController.findAllProducts))
router.get('/product/:product_id', asyncHandler(productController.findProductsDetail))

// authentication
router.use(authorizationv2)

// create product
router.post('/product', asyncHandler(productController.createProduct))
router.post('/product/published/:id', asyncHandler(productController.publishProducByShop))
router.post('/product/unpublished/:id', asyncHandler(productController.unPublishProducByShop))

// get all list draft
router.get('/product/drafts/all', asyncHandler(productController.getAllDraftForShop))
router.get('/product/published/all', asyncHandler(productController.getAllPublishForShop))


module.exports = router
