const keytokenModel = require("../models/keytoken.model")

class KeyTokensService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      const tokens = await keytokenModel.create({ user: userId, publicKey: publicKey, privateKey })
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }
}

module.exports = KeyTokensService
