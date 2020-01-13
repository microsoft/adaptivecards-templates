const makeBaseElement = require('../utils/make-base-element')
const addDescriptions = require('../utils/add-descriptions')
const makeLabel = require('../utils/make-label')

module.exports = function inputToggleElementGenerator (key, config, options) {
  const elements = []

  const numberElement = makeBaseElement(key, 'Input.Toggle', config)
  addDescriptions(numberElement, config)
  if (config.showWhen) {
    numberElement.showWhen = config.showWhen
  }
  elements.push(numberElement)
  return elements
}
