module.exports = function infoGenerator (key, config, options) {
  const elements = []
  const infoContainer = {
    type: 'Container',
    style: 'emphasis',
    items: [
      {
        type: 'TextBlock',
        text: config.text
          .replace(/<\/p> /g, '<br><br> ')
          .replace(/\t/g, ' ')
          .replace(/\n/g, '')
          .replace(/  +/g, ' ')
          .replace(/<p>/g, '')
          .replace(/\n /g, '<br> ')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\')
          .trim(),
        size: 'small',
        wrap: true
      }
    ]
  }

  if (config.showWhen) {
    infoContainer.showWhen = config.showWhen
  }
  elements.push(infoContainer)
  return elements
}
