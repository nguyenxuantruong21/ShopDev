const _ = require('lodash')

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds)
}

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}

const unSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefineObject = obj => {
  Object.keys(obj).forEach(k => {
    if (obj[k] === null)
      delete obj[k]
  })
  return obj
}


/**
 *
 * @param  obj
 * @returns  {final object}
 */

const updateNestedObjectParser = obj => {
  const final = {}
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k])
      Object.keys(response).forEach(a => {
        final[`${k}.${a}`] = response[a]
      })
    } else {
      final[k] = obj[k]
    }
  })
  return final
}

module.exports = {
  unSelectData, getInfoData, getSelectData, removeUndefineObject, updateNestedObjectParser
}
