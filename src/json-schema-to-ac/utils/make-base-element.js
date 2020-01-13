module.exports = function makeBaseElement (key, type, config) {
  return {
    id: key,
    type: type,
    title: config.title
  }
}
