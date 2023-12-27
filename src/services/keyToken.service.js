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
    return await keytokenModel.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = KeyTokensService
