const processOptions = require('./process-options')
const headerGenerator = require('./element-generators/header')
const addElementsFromProperties = require('./add-elements-from-properties')
const makeEmptySchema = require('./utils/make-empty-schema')

module.exports = function jsonSchemaToAc(jsonSchema, originalOptions) {
  const options = processOptions(jsonSchema, originalOptions)
  const cardscript = makeEmptySchema(options)

  // Add a Jumbotron header
  cardscript.body.push(...headerGenerator(null, null, options))

  addElementsFromProperties(jsonSchema, cardscript.body, options)

  cardscript.meta = constructMeta(options)

  return cardscript
}

function constructMeta (options) {
  const meta = {
    generatedOn: new Date().toLocaleString()
  }

  if (options.generator) {
    meta.generatedWith = options.generator
  }
  if (options.modelName) {
    meta.data = {
      modelName: options.modelName
    }
  }

  return meta
}
