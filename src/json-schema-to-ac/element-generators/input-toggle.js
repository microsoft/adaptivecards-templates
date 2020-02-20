const makeBaseElement = require('../utils/make-base-element')

module.exports = function inputToggleElementGenerator (key, config, options) {
  const elements = []

  const toggleElement = makeBaseElement(key, 'Input.Toggle', config)

  if(config.description) {
    const description = {
        type: 'TextBlock',
        text: config.description,
        wrap: true,
        spacing: 'none'
    }

    elements.push(description)
}

  if(config.default === true) {
    toggleElement.value = "true"
  }
  if (config.showWhen) {
    toggleElement.showWhen = config.showWhen
  }
  elements.push(toggleElement)
  return elements
}
