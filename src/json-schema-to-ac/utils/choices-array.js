function choicesToChoiceArray (choices) {
  return choices
    .map(choice => {
      let title
      let value
      if (Array.isArray(choice)) {
        [value, title] = choice
      } else if (choice.indexOf('|') === -1) {
        title = choice
        value = choice
      } else {
        title = choice.substr(choice.indexOf('|') + 1)
        value = choice.substr(0, choice.indexOf('|'))
      }

      return {
        title,
        value
      }
    })
} // choicesToChoiceArray

module.exports = choicesToChoiceArray
