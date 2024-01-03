const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");


class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Successfull Code Generations',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getAllDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Successfull Code Found',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getDiscountAmout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Successfull Code Found',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getAllDiscountCodeWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Successfull Code Found',
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query
      })
    }).send(res)
  }
}


module.exports = new DiscountController()
