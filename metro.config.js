const {getDefaultConfig} = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {isCSSEnabled: true})


config.resolver = {
    ...config.resolver,
    assetExts: [...config.resolver.assetExts, 'txt']
}

const {withTamagui} = require('@tamagui/metro-plugin')
module.exports = withTamagui(config, {
    components: ['tamagui'],
    config: './tamagui.config.ts',
    outputCSS: './.tamagui/tamagui-web.css'
})

