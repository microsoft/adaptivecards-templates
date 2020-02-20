const changeCase = require("change-case")

module.exports = function makeLabel(key, config) {
    const container = {
        type: 'Container',
        items: []
    }

    let title
    if (config.title) {
        title = config.title
    } else {
        title = changeCase.sentenceCase(key)
    }

    const label = {
        type: 'TextBlock',
        text: title,
        wrap: true,
        maxLines: 2,
        size: 'Medium'
    }

    if (config.required) {
        label.text += "*"
    }

    container.items.push(label)

    if(config.description) {
        const description = {
            type: 'TextBlock',
            text: config.description,
            wrap: true,
            spacing: 'none'
        }

        container.items.push(description)
    }

    return container;
}
