module.exports = function makeEmptySchema (options) {
  const schema = {
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.0',
    type: 'AdaptiveCard',
    body: [],
    actions: []
  }

  if (options) {
    schema.templateMeta = {
      name: options.name,
      title: options.cardscriptTitle,
      category: options.category
    }
  }

  if (!options || !options.viewOnly) {
    schema.actions.push({
      type: 'Action.Submit',
      title: 'Cancel'
    }, {
      type: 'Action.Submit',
      title: 'Submit'
    })
  } else {
    schema.actions.push({
      type: 'Action.Submit',
      title: 'Close'
    })
  }

  return schema
}
