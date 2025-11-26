import {createThemes, defaultComponentThemes} from '@tamagui/theme-builder'
import * as Colors from '@tamagui/colors'

const lightShadows = {
    shadow1: 'rgba(0,0,0,0.04)',
    shadow2: 'rgba(0,0,0,0.08)',
    shadow3: 'rgba(0,0,0,0.16)',
    shadow4: 'rgba(0,0,0,0.24)',
    shadow5: 'rgba(0,0,0,0.32)',
    shadow6: 'rgba(0,0,0,0.4)',
}

const darkShadows = {
    shadow1: 'rgba(0,0,0,0.2)',
    shadow2: 'rgba(0,0,0,0.3)',
    shadow3: 'rgba(0,0,0,0.4)',
    shadow4: 'rgba(0,0,0,0.5)',
    shadow5: 'rgba(0,0,0,0.6)',
    shadow6: 'rgba(0,0,0,0.7)',
}


const defaultLight = [
    '#fafafa', '#f2f2f3', '#ebebec', '#e3e3e6', '#dcdcdf', '#d4d4d8',
    '#afafb2', '#8a8a8c', '#656567', '#404041', '#1f1f21', '#000000',
]

const defaultDark = [
    '#0d0d0e', '#19191c', '#26262a', '#323238', '#3f3f46', '#52525b',
    '#65656b', '#8c8c90', '#b2b2b5', '#d9d9da', '#efeff0', '#ffffff',
]
const primaryLight = [
    '#e0e5e8', '#b4c2c8', '#889ea7', '#5d7a87', '#315666', '#053246',
    '#04293a', '#03212e', '#021821', '#020f15', '#010b10', '#00080a',
]

const primaryDark = [
    '#003d67', '#004d7f', '#005d97', '#0070b0', '#0084c7', '#1798db',
    '#3aaced', '#5dc0fc', '#80d0ff', '#a3dfff', '#c6ecff', '#e8f7ff',
]

const secondaryLight = [
    '#003d67', '#004d7f', '#005d97', '#0070b0', '#0084c7', '#1798db',
    '#3aaced', '#5dc0fc', '#80d0ff', '#a3dfff', '#c6ecff', '#e8f7ff',
]

const secondaryDark = [
    '#e0e5e8', '#b4c2c8', '#889ea7', '#5d7a87', '#315666', '#053246',
    '#04293a', '#03212e', '#021821', '#020f15', '#010b10', '#00080a',
]
const successLight = [
    '#e2f8ec', '#b9efd1', '#91e5b5', '#68dc9a', '#40d27f', '#17c964',
    '#13a653', '#0f8341', '#0b5f30', '#073c1e', '#063216', '#041f0e',
]

const successDark = [
    '#073c1e', '#0b5f30', '#0f8341', '#13a653', '#17c964', '#40d27f',
    '#68dc9a', '#91e5b5', '#b9efd1', '#e2f8ec', '#e8fbf1', '#f1fdf6',
]

const warningLight = [
    '#fef4e4', '#fce4bd', '#fad497', '#f9c571', '#f7b54a', '#f5a524',
    '#ca881e', '#9f6b17', '#744e11', '#4a320b', '#3a2709', '#261a06',
]

const warningDark = [
    '#4a320b', '#744e11', '#9f6b17', '#ca881e', '#f5a524', '#f7b54a',
    '#f9c571', '#fad497', '#fce4bd', '#fef4e4', '#fff6e9', '#fff9f0',
]

const dangerLight = [
    '#fee1eb', '#fbb8cf', '#f98eb3', '#f76598', '#f53b7c', '#f31260',
    '#c80f4f', '#9e0c3e', '#73092e', '#49051d', '#340315', '#21020d',
]

const dangerDark = [
    '#49051d', '#73092e', '#9e0c3e', '#c80f4f', '#f31260', '#f53b7c',
    '#f76598', '#f98eb3', '#fbb8cf', '#fee1eb', '#fff0f5', '#fff6f9',
]

export const themes = createThemes({
    componentThemes: defaultComponentThemes,
    base: {
        palette: {
            light: defaultLight,
            dark: defaultDark,
        },
        extra: {
            light: {
                ...lightShadows,
                shadowColor: lightShadows.shadow1,
                ...Colors.gray,
                ...Colors.blue,
                ...Colors.green,
                ...Colors.orange,
                ...Colors.purple,
                ...Colors.cyan,
                ...Colors.red,
                background: '#f8f8ff',
                color: '#1f1f21',
                borderColor: '#e4e4e7',
                placeholderColor: '#8a8a8c',
                focusColor: '#0084c7',
                overlay: '#000000',
                content1: '#ffffff',
                content2: '#f5f5f6',
                content3: '#e4e4e7',
                content4: '#d1d1d6',
                ctaBg: '#5d7a87',
                ctaBgHover: '#315666',
                ctaBgPress: '#5d7a87',
                ctaText: '#ffffff',
            },
            dark: {
                ...darkShadows,
                shadowColor: darkShadows.shadow1,
                ...Colors.grayDark,
                ...Colors.blueDark,
                ...Colors.greenDark,
                ...Colors.orangeDark,
                ...Colors.purpleDark,
                ...Colors.cyanDark,
                ...Colors.redDark,
                background: '#101828',
                color: '#f0f0f0',
                borderColor: '#52525b',
                placeholderColor: '#8c8c90',
                focusColor: '#053246',
                overlay: '#ffffff',
                content1: '#18181b',
                content2: '#27272a',
                content3: '#3f3f46',
                content4: '#52525b',
                ctaBg: '#63ad63',
                ctaBgHover: '#a7e2a7',
                ctaBgPress: '#4e894e',
                ctaText: '#000000',
            },
        },
    },
    accent: {
        palette: {
            light: primaryLight,
            dark: primaryDark,
        },
    },
    childrenThemes: {
        secondary: {
            palette: {
                light: secondaryLight,
                dark: secondaryDark,
            },
        },
        success: {
            palette: {light: successLight, dark: successDark},
        },
        warning: {
            palette: {light: warningLight, dark: warningDark},
        },
        error: {
            palette: {light: dangerLight, dark: dangerDark},
        },
    },
})
