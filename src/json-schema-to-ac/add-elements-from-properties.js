const _ = require('lodash')
const elementGeneratorPicker = require('./element-generator-picker')

module.exports = function addElementsFromProperties (root, targetArray, options) {
  const selectedProperties = selectProperties(root.properties, options.fields)

  for (let [key, property] of Object.entries(selectedProperties)) {
    // Sort multiple
    if (property.type === 'array') {
      property.multiple = true
      // Promote any item-level attributes to top-level
      property = _.defaults(property, property.items)
      property.type = property.items.type
      delete property.items
    } else {
      property.multiple = false
    }

    // Derive if required
    property.propertyRequired = isRequired(root, key)

    const elementGenerator = elementGeneratorPicker(key, property, options)
    const elements = elementGenerator(key, property, options)

    elements.forEach(element => {
      if (_.isObject(element.card)) {
        const opts = { ...options }
        opts.fields = null
        addElementsFromProperties(property, element.card.body, opts)
      } else if (element.type === 'Container') {
        const opts = { ...options }
        opts.fields = null
        addElementsFromProperties(property, element.items, opts)
      }
    })
    targetArray.push(...elements)
  }
}

function selectProperties (properties = { }, fields) {
  fields = fields || Object.keys(properties)
  const selected = { }

  for (const field of fields) {
    selected[field] = _.cloneDeep(properties[field])
  }

  return selected
} // selectedProperties

function isRequired (root, key) {
  return root.required && root.required.indexOf(key) !== -1
}
