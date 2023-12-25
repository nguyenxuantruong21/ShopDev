const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    try {
      return res.status(201).json(await AccessService.signUp(req.body))
    } catch (error) {
      console.log('error');
    }
  }
}

module.exports = new AccessController()
