module.exports = function headerGenerator (key, config, options) {
    const container = {
      type: 'Container',
      items: [
          {
              type: 'TextBlock',
              text: options.cardscriptTitle,
              size: 'medium',
              weight: 'bolder'
          },
          {
            type: 'TextBlock',
            text: options.cardscriptSubTitle,
            size: 'medium',
            weight: 'bolder'
        }
      ]
    }
    if (config && config.showWhen) {
      jumbotronElement.showWhen = config.showWhen
    }
    return [ container ]
  }
  