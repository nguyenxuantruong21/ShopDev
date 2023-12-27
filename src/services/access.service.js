const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokensService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require('../utils/index')
const { BadRequestError, AuthFailuredError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}
class AccessService {

  static handlerRefreshToken = async (refreshToken) => {

  }

  static logOut = async (keyStore) => {
    const delKey = await KeyTokensService.removeKeyById(keyStore._id)
    return delKey
  }

  static logIn = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email })
    if (!foundShop) {
      throw new BadRequestError('Shop is not register')
    }
    const match = bcrypt.compare(password, foundShop.password)
    if (!match) {
      throw new AuthFailuredError('Authorization Error')
    }
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)
    await KeyTokensService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })
    return {
      shop: getInfoData({ object: foundShop, fileds: ['_id', 'name', 'email'] }),
      tokens
    }
  }

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
      // step5: get keystore from dataBase => publickey
      const keyStore = await KeyTokensService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      })
      if (!keyStore) {
        return {
          code: 'xxx',
          message: 'PublicKeyString Error'
        }
      }
      // created token pair about accesstoken and refreshtoken
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
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
