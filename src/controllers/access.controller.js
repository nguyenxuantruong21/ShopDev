const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  logIn = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.logIn(req.body)
    }).send(res)
  }

  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Register OK !!!',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res)
  }
}

module.exports = new AccessController()
