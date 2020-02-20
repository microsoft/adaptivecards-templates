const makeBaseElement = require('../utils/make-base-element')
const addDescriptions = require('../utils/add-descriptions')
const makeLabel = require('../utils/make-label')

module.exports = function inputTextElementGenerator (key, config, options) {
  const elements = []
  elements.push(makeLabel(key, config))

  const numberElement = makeBaseElement(key, 'Input.Number', config)
  addDescriptions(numberElement, config)
  if (config.showWhen) {
    numberElement.showWhen = config.showWhen
  }
  elements.push(numberElement)
  return elements
}
