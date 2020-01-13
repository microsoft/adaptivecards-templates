const enumToChoiceArray = require('../utils/choices-array')

module.exports = function outputElementGenerator (key, config, options) {
  const element = {
    type: 'FactSet',
    facts: [{
      title: config.title,
      value: `{{data.${key}}}`
    }]
  }

  if (config.enum) {
    element.facts[0].choices =
      enumToChoiceArray(config.enum)
  }
  if (config.showWhen) {
    element.showWhen = config.showWhen
  }

  return [element]
}
