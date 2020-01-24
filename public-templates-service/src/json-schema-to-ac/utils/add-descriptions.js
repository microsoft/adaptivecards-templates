module.exports = function addDescriptions (element, config) {
  if (config.hasOwnProperty('examples') && config.examples.length > 0) {
    let placeholder = JSON.stringify(config.examples[0])
    // TODO: " characters cause crashes?
    placeholder = placeholder.replace(/"/g, '')
    element.placeholder = `e.g. ${placeholder}`
  }
}
