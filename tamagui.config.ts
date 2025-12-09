import {createTamagui, createFont} from 'tamagui'
import {config as defaultConfig} from '@tamagui/config/v3'
import {themes} from './themes'

const interFont = createFont({
    family: 'Inter_400Regular',
    size: defaultConfig.fonts.body.size,
    lineHeight: defaultConfig.fonts.body.lineHeight,
    letterSpacing: defaultConfig.fonts.body.letterSpacing,
    weight: defaultConfig.fonts.body.weight,
    face: {
        400: {normal: 'Inter_400Regular'},
        500: {normal: 'Inter_500Medium'},
        600: {normal: 'Inter_600SemiBold'},
        700: {normal: 'Inter_700Bold'},
    },
})

const oswaldFont = createFont({
    family: 'Oswald_400Regular',
    size: defaultConfig.fonts.body.size,
    lineHeight: defaultConfig.fonts.body.lineHeight,
    letterSpacing: defaultConfig.fonts.body.letterSpacing,
    weight: defaultConfig.fonts.body.weight,
    face: {
        400: {normal: 'Oswald_400Regular'},
        500: {normal: 'Oswald_500Medium'},
        600: {normal: 'Oswald_600SemiBold'},
        700: {normal: 'Oswald_700Bold'},
    },
})

export const config = createTamagui({
    ...defaultConfig,
    fonts: {
        ...defaultConfig.fonts,
        body: interFont,
        heading: interFont,
        oswald: oswaldFont,
    },
    themes: {
        ...defaultConfig.themes,
        ...themes,
    },
    media: {
        xs: {maxWidth: 660},
        sm: {maxWidth: 800},
        md: {maxWidth: 1024},
        lg: {maxWidth: 1280},
        xl: {maxWidth: 1536},
        xxl: {minWidth: 1536},
        gtMd: {minWidth: 1025},
    },
})

export type AppConfig = typeof config
declare module 'tamagui' {
    interface TamaguiCustomConfig extends AppConfig {
    }
}

export default config
