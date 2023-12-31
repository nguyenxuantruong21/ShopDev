const { clothing, electronic, product, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { findAllDraftsForShop, publicProductByShop, findAllPublishForShop, unPublicProductByShop, searchProduct, findAllProducts, findFroductDetail, } = require('../models/repositories/product.repo')

// define to call sub-class
class ProductFactory {
  /**
   * step 1: create productRegistry to save {"type":"classRef"}
   * step 2: get class and created product
   */
  static productRegistry = {}
  static registerProductType(type, classRef) {
    this.productRegistry[type] = classRef
  }
  static async createProduct(type, payload) {
    const productClass = this.productRegistry[type]
    if (!productClass) throw new BadRequestError(`Invalide Product Type ${type}`)
    return new productClass(payload).createProduct()
  }

  // PUT
  static publicProductByShop = async ({ product_shop, product_id }) => {
    return await publicProductByShop({ product_shop, product_id })
  }

  static unPublicProductByShop = async ({ product_shop, product_id }) => {
    return await unPublicProductByShop({ product_shop, product_id })
  }

  static updateProduct = async ({ product_shop, product_id }) => {
  }
  /**
    QUERY => PRODUCT
   */
  static findAllDraftsForShop = async ({ product_shop, limit = 50, skip = 0 }) => {
    const query = { product_shop, isDraft: true }
    return await findAllDraftsForShop({ query, limit, skip })
  }

  static findAllPublishForShop = async ({ product_shop, limit = 50, skip = 0 }) => {
    const query = { product_shop, isPublished: true }
    return await findAllPublishForShop({ query, limit, skip })
  }

  // search product
  static searchProduct = async ({ keySearch }) => {
    return await searchProduct({ keySearch })
  }

  // find Product
  static findAllProducts = async ({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) => {
    return await findAllProducts({ limit, sort, filter, page, select: ['product_name', 'product_price', 'product_thumb'] })
  }

  static findProductsDetail = async ({ product_id }) => {
    return await findFroductDetail({ product_id, unSelect: ['__v'] })
  }
}

// class parent define product
class Product {
  constructor(
    { product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes }
  ) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }
  // product_id is id of product detail
  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id })
  }
}

// define sub-class for different product types clothing
class Clothing extends Product {
  /**
   * step 1: create new clothing and check => create new Product
   * @returns
   */
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes)
    if (!newClothing) throw BadRequestError('Create new clothing error')
    // id synchronization between parent class vs sub-class
    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw BadRequestError('Create new product error')
    return newProduct
  }
}

// define sub-class for different product types electronic
class Electronics extends Product {
  /**
 * step 1: create new electronic and check => create new Product
 * @returns
 */
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newElectronic) throw BadRequestError('Create new electronic error')
    // id synchronization between parent class vs sub-class
    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw BadRequestError('Create new product error')
    return newProduct
  }
}


class Furniture extends Product {
  /**
 * step 1: create new electronic and check => create new Product
 * @returns
 */
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newFurniture) throw BadRequestError('Create new furniture error')
    // id synchronization between parent class vs sub-class
    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw BadRequestError('Create new product error')
    return newProduct
  }
}

ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)


module.exports = ProductFactory
