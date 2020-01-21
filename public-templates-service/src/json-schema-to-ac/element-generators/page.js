
module.exports = function pageGenerator (key, config, options) {
  // console.log('config: ', config)
  const elements = []
  const propsBody = []
  const page = {
    type: 'Container',
    items: [
      {
        type: 'TextBlock',
        text: key,
        wrap: true,
        size: 'medium'
      }
    ]
  }
  propsBody.forEach(prop => {
    page.items.push(prop)
  })
  if (config.showWhen) {
    page.showWhen = config.showWhen
  }
  elements.push(page)
  return elements
}
