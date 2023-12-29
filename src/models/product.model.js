const { Schema, model } = require('mongoose')
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productShema = new Schema({
  product_name: { type: String, required: true },
  product_thumb: { type: String, required: true },
  product_description: { type: String },
  product_price: { type: Number, required: true },
  product_quantity: { type: Number, required: true },
  product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  product_attributes: { type: Schema.Types.Mixed, required: true }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

// define the product type = clothing
const clothingSchema = new Schema({
  brand: { type: String, required: true },
  size: { type: String },
  material: { type: String }
}, {
  collection: 'clothes',
  timestamps: true
})

// define the product type = electronic
const electronicSchema = new Schema({
  manufacturer: { type: String, required: true },
  model: { type: String },
  color: { type: String }
}, {
  collection: 'electronics',
  timestamps: true
})


const furnitureSchema = new Schema({
  brand: { type: String, required: true },
  size: { type: String },
  material: { type: String }
}, {
  collection: 'furnitures',
  timestamps: true
})



module.exports = {
  product: model(DOCUMENT_NAME, productShema),
  electronic: model('Electronics', electronicSchema),
  clothing: model('Clothing', clothingSchema),
  furniture: model('Furniture', furnitureSchema)
}
