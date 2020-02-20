const changeCase = require("change-case")

module.exports = function makeBaseElement (key, type, config) {
  let title
  if (config.title) {
    title = config.title
  } else {
      title = changeCase.sentenceCase(key)
  }

  return {
    id: key,
    type: type,
    title: title
  }
}
