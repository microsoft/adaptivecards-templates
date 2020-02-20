const makeBaseElement = require('../utils/make-base-element')
const addDescriptions = require('../utils/add-descriptions')
const makeLabel = require('../utils/make-label')

module.exports = function inputTextElementGenerator (key, config, options) {
  const elements = []
  elements.push(makeLabel(key, config))

  const textElement = makeBaseElement(key, 'Input.Text', config)
  addDescriptions(textElement, config)

  if(config.default) {
    textElement.value = config.default
  }

  if (config.showWhen) {
    textElement.showWhen = config.showWhen
  }

  elements.push(textElement)
  return elements
}
