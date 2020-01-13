module.exports = function jumbotronElementGenerator (key, config, options) {
  const jumbotronElement = {
    type: 'Jumbotron',
    title: options.cardscriptTitle,
    subtitle: options.cardscriptSubTitle
  }
  if (config && config.showWhen) {
    jumbotronElement.showWhen = config.showWhen
  }
  return [ jumbotronElement ]
}
