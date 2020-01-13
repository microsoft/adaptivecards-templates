module.exports = function tableOutputElementGenerator (key, config, options) {
  const tableColumns =
    config.columns
      .map(c => {
        return {
          title: options.modelSchema.properties[c].title,
          field: c
        }
      })

  const element = {
    type: 'Table',
    arrayPath: config.arrayPath,
    columns: tableColumns
  }
  if (config.showWhen) {
    element.showWhen = config.showWhen
  }

  return [element]
} // tableOutputElementGenerator
