const { findById } = require('../services/apiKey.service')

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]
    // step1: check key exist
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    // step2: check objKey in database
    const objKey = await findById(key)
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    req.objKey = objKey
    return next()
  } catch (error) {
    console.log(error);
  }
}

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'Permission denied'
      })
    }
    const validPermission = req.objKey.permissions.includes(permission)
    if (!validPermission) {
      return res.status(403).json({
        message: 'Permission denied'
      })
    }
    return next()
  }
}

module.exports = {
  apiKey,
  permission
}
