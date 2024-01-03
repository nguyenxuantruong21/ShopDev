const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authorizationv2 } = require('../../auth/authUtils')
const discountController = require('../../controllers/discount.controller')

const router = express.Router()

router.post('/amount', asyncHandler(discountController.getDiscountAmout))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodeWithProduct))

// authentication V2
router.use(authorizationv2)

router.post('', asyncHandler(discountController.createDiscountCode))
router.post('', asyncHandler(discountController.getAllDiscountCode))




module.exports = router
