const keytokenModel = require("../models/keytoken.model")

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
}

module.exports = KeyTokensService
