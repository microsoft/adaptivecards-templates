module.exports = function makeLabel(config) {
    if (config.title) {
        const textBlock = {
            type: 'TextBlock',
            text: config.title
        }

        if (config.required) {
            textBlock.text += "*"
        }

        return textBlock
    }

    return {};
}
