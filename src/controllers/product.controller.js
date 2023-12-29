const { SuccessResponse } = require("../core/success.response");
const ProductService = require('../services/product.service')
class ProductController {
  //CREATED
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Product success',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }
  //END CREATED


  // QUERY //
  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List Draft Successfully !!!',
      metadata: await ProductService.findAllDraftsForShop({ product_shop: req.user.userId })
    }).send(res)
  }
  // END QUERY //
}


module.exports = new ProductController()
