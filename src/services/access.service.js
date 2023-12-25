const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokensService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require('../utils/index')

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}
class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exists
      const hodelShop = await shopModel.findOne({ email }).lean()
      if (hodelShop) {
        return {
          code: 'xxx',
          message: 'Shop Already register'
        }
      }
      // step2: hash password
      const passwordHash = await bcrypt.hash(password, 10)
      // step3: create shop
      const newShop = await shopModel.create({
        name, email, password: passwordHash, roles: [RoleShop.SHOP]
      })
      if (newShop) {
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        const keysStore = await KeyTokensService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
        })
        if (!keysStore) {
          return {
            code: 'xxx',
            message: 'PublicKeyString Error'
          }
        }
        // created token pair
        const tokens = await createTokenPair({ userId: newShop, email }, publicKey, privateKey)
        return {
          code: 201,
          metadata: {
            shop: getInfoData({ object: newShop, fileds: ['_id', 'name', 'email'] }),
            tokens
          }
        }
      }
      return {
        code: 200,
        metadata: null
      }
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }
}

module.exports = AccessService
