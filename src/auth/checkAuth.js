const { findById } = require("../services/apiKey.service")

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    // check objKey
    const objectKey = await findById(key)
    if (!objectKey) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    req.objectKey = objectKey
    return next()
  } catch (error) {

  }
}

const permissions = (permission) => {
  return (req, res, next) => {
    if (!req.objectKey.permissions) {
      return res.status(403).json({
        message: 'permission denied'
      })
    }
    console.log(`permissions::`, req.objectKey.permissions);
    const validPermission = req.objectKey.permissions.include(permission)
    if (!validPermission) {
      return res.status(403).json({
        message: 'permission denied'
      })
    }
    return next()
  }
}

module.exports = {
  apiKey,
  permissions
}



