const { BadRequestError, NotFoundError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { product } = require("../models/product.model")
const { findAllDiscountCodesUnSelect, checkDiscountExist, findAllDiscountCodesSelect } = require("../models/repositories/discount.repo")
const { findAllProducts } = require("../models/repositories/product.repo")
const { convertToObjectId } = require("../utils")


class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code, start_date, end_date, is_active, shopId, min_order_value, product_ids, applies_to, name,
      discription, type, value, max_value, max_uses, uses_count, max_uses_per_user, users_used
    } = payload

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before end date')
    }

    // create index for discount
    const foundDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shopId: convertToObjectId(shopId)
    }).lean()

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount exist')
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: discription,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    })
    return newDiscount
  }

  /**
   * update discount code
   */
  static async updateDiscountCode() {
    //..
  }

  /**
   * get all discount codes availabel with product
   */

  static async getAllDiscountCodesWithProduct({
    code, shopId, userId, limit, page
  }) {
    // create index for discount code
    const foundDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shopId: convertToObjectId(shopId)
    }).lean()

    //  !foundDiscount.discount_is_active
    if (!foundDiscount) {
      throw new NotFoundError('Discount not exist')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount
    let products
    if (discount_applies_to === 'all') {
      // get all product
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }
    if (discount_applies_to === 'specific') {
      // get all product
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
      console.log('this is my', products);

    }
    return products
  }

  /**
   * get all dicount codes  of shop
   */
  static getAllDiscountCodesByShop = async ({
    limit, page, shopId
  }) => {
    const discounts = await findAllDiscountCodesSelect({
      limit: +limit, page: +page,
      filter: {
        discount_shopId: convertToObjectId(shopId),
        discount_is_active: true
      },
      select: ['discount_shopId', 'discount_name'],
      model: discountModel
    })
    return discounts
  }

  /**
   * Apply discount code
   * product = [
   *  {
   *    productId,
   *    shopId
   *    quantity
   *    name
   *    price
   *  }
   * ]
   */

  static async getDiscountAmount({
    codeId, userId, shopId, products
  }) {
    const foundDiscount = await checkDiscountExist({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId)
      }
    })
    if (!foundDiscount) {
      throw new NotFoundError('Discount do not exitst')
    }
    const {
      discount_is_active,
      discount_start_date,
      discount_end_date,
      discount_max_uses,
      discount_min_order_value,
      discount_users_used
    } = foundDiscount
    if (!discount_is_active) throw new NotFoundError('Discount expried')
    if (!discount_max_uses) throw new NotFoundError('Discount are out')

    if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
      throw new NotFoundError('Discount ecode has expried')
    }
    // chech xem co et gia tri toi thieu hay khong
    let totalOrder = 0
    if (discount_min_order_value > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(`Discound require as minium order value of ${discount_min_order_value}`)
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUserDiscount = discount_users_used.find(user => user.userId === userId)
      if (userUserDiscount) {
        //..
      }
    }
    // check xem discount la fixec_amount
    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

    return {
      totalOrder,
      amount,
      totalPrice: totalOrder - amount
    }
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectId(shopId)
    })
    return deleted
  }


  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExist({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId)
      }
    })

    if (!foundDiscount) throw new NotFoundError('discount do not exitst')
    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    })
    return result
  }
}

module.exports = DiscountService
