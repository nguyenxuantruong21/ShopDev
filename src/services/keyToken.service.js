const keytokenModel = require("../models/keytoken.model")
const { Types: { ObjectId } } = require('mongoose')
class KeyTokensService {
  // save publickey and privatekey in database and return publickey
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      const filter = { user: userId }
      const update = { publicKey, privateKey, refreshsTokenUsed: [], refreshToken }
      const options = { upsert: true, new: true }
      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }

  static findByUserId = async (userId) => {
    return keytokenModel.findOne({ user: new ObjectId(userId) }).lean()
  }

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne({ _id: new ObjectId(id) })
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshsTokenUsed: refreshToken }).lean()
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken: refreshToken })
  }

  static deleteKeyById = async (userId) => {
    return await keytokenModel.deleteOne({ user: new ObjectId(userId) })
  }

}

module.exports = KeyTokensService
