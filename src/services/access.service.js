const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokensService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require('../utils/index')
const { BadRequestError } = require('../core/error.response')

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}
class AccessService {
  static signUp = async ({ name, email, password }) => {
    // step1: check email exists
    const hodelShop = await shopModel.findOne({ email }).lean()
    if (hodelShop) {
      throw new BadRequestError('Error:: Shop already register !!!')
    }
    // step2: hash password
    const passwordHash = await bcrypt.hash(password, 10)
    // step3: created shop
    const newShop = await shopModel.create({
      name, email, password: passwordHash, roles: [RoleShop.SHOP]
    })
    if (newShop) {
      // step4: created privatekey, publickey
      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')
      // get keystore from dataBase => publickey
      const keyStore = await KeyTokensService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey
      })
      if (!keyStore) {
        return {
          code: 'xxx',
          message: 'PublicKeyString Error'
        }
      }
      // created token pair about accesstoken and refreshtoken
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
  }
}

module.exports = AccessService
