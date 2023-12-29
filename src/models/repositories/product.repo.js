const { clothing, electronic, furniture, product } = require('../../models/product.model')
const { Types: { ObjectId } } = require('mongoose')

// create query product basic
const queryProduct = async ({ query, limit, skip }) => {
  return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean().exec()
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const searchProduct = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch)
  const results = await product.find({
    isPublished: true,
    $text: { $search: regexSearch }
  }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .lean()
  return results
}

const publicProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new ObjectId(product_shop),
    _id: new ObjectId(product_id)
  })
  if (!foundShop) return null
  foundShop.isDraft = false
  foundShop.isPublished = true
  const { modifiedCount } = await foundShop.updateOne(foundShop)
  return modifiedCount
}

const unPublicProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new ObjectId(product_shop),
    _id: new ObjectId(product_id)
  })
  if (!foundShop) return null
  foundShop.isDraft = true
  foundShop.isPublished = false
  const { modifiedCount } = await foundShop.updateOne(foundShop)
  return modifiedCount
}


module.exports = {
  findAllDraftsForShop,
  findAllPublishForShop,
  publicProductByShop,
  unPublicProductByShop,
  searchProduct
}
