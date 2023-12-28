const { clothing, electronic, product } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')


class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case 'Clothing':
        return new Clothing(payload).createProduct()
      case 'Electronics':
        return new Electronics(payload)
      default:
        throw new BadRequestError(`Invalide Product Type ${type}`)
    }
  }
}

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
  async createProduct() {
    return await product.create(this)
  }
}

// define sub-class for different product types clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes)
    if (!newClothing) throw BadRequestError('Create new clothing error')
    const newProduct = await super.createProduct()
    if (!newProduct) throw BadRequestError('Create new product error')
  }
}

// define sub-class for different product types electronic
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create(this.product_attributes)
    if (!newElectronic) throw BadRequestError('Create new electronic error')
    const newProduct = await super.createProduct()
    if (!newProduct) throw BadRequestError('Create new product error')
    s
  }
}

module.exports = ProductFactory
