const _ = require('lodash')

const TITLE_SUFFIXES = {
  'editing': 'Editor',
  'viewing': 'Viewer',
  'creating': 'Maker'
}

function processOptions (jsonSchema, originalOptions) {
  let options = _.cloneDeep(originalOptions || {})
  options = _.defaults(
    options,
    {
      purpose: 'editing',
      schemaFilename: 'unknown.json',
      schemaTitle: jsonSchema.title,
      schemaDescription: jsonSchema.description
    }
  )

  if (!options.fields) {
    options.fields = Object.keys(jsonSchema.properties)
  }

  // Stripped filename (useful if no title/description provided)
  // 'some-thing.json' => 'some thing'
  // 'someThing/json' => 'some thing'
  options.strippedFilename = options.schemaFilename.split('.')[0]
  options.strippedFilename = _.kebabCase(options.strippedFilename)
  options.strippedFilename = options.strippedFilename.replace(/-/g, ' ')

  options.simpleTitle = simpleTitle(options)
  options.cardscriptTitle = cardscriptTitle(options)
  options.cardscriptSubTitle = cardscriptSubTitle(options)

  options.viewOnly = Object.entries(jsonSchema.properties)
    .filter(([k]) => options.fields.includes(k))
    .map(([k, v]) => v.output)
    .filter(t => !t)
    .length === 0

  return options
} // processOptions

function simpleTitle (options) {
  return options.schemaTitle ||
    _.upperFirst(options.modelName) ||
    _.upperFirst(options.strippedFilename)
} // modelName

function cardscriptTitle (options) {
  return options.title ||
    `${options.simpleTitle} ${TITLE_SUFFIXES[options.purpose]}`
} // cardscriptTitle

function cardscriptSubTitle (options) {
  return options.description ||
    `A form for ${options.purpose} a ${options.simpleTitle}.`
} // cardscriptSubTitle

module.exports = processOptions
