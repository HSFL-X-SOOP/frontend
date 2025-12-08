import { styled, Button } from 'tamagui'

export const PrimaryButton = styled(Button, {
    name: 'PrimaryButton',
    borderRadius: '$6',
    paddingHorizontal: '$6',
    paddingVertical: '$4',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '$accent5',
    borderWidth: 1,
    borderColor: '$accent7',
    fontWeight: '600',
    fontSize: '$4',
    shadowColor: '$accent3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    hoverStyle: {
        backgroundColor: '$accent8',
        borderColor: '$accent8',
        shadowOpacity: 0.3,
        scale: 1.01,
    },

    pressStyle: {
        backgroundColor: '$accent6',
        borderColor: '$accent6',
        scale: 0.98,
    },

    focusStyle: {
        borderColor: '$accent9',
        shadowOpacity: 0.4,
    },

    disabledStyle: {
        opacity: 0.5,
        pointerEvents: 'none',
        backgroundColor: '$accent4',
        borderColor: '$accent4',
    },
})


export const SecondaryButton = styled(Button, {
    name: 'SecondaryButton',

    // Layout
    borderRadius: '$6',
    paddingHorizontal: '$6',
    paddingVertical: '$4',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '$accent7',
    fontWeight: '600',
    fontSize: '$4',
    shadowColor: '$accent3',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    hoverStyle: {
        backgroundColor: '$ctaBgHover',
        opacity: 1,
        borderColor: '$accent8',
        shadowOpacity: 0.15,
        scale: 1.01,
    },

    pressStyle: {
        backgroundColor: '$accent3',
        borderColor: '$accent6',
        scale: 0.98,
    },

    focusStyle: {
        borderColor: '$accent9',
        shadowOpacity: 0.3,
    },

    disabledStyle: {
        opacity: 0.5,
        pointerEvents: 'none',
        borderColor: '$accent4',
    },
})

export const PrimaryButtonText = styled(Button.Text, {
    name: 'PrimaryButtonText',
    color: 'white',
    fontWeight: '600',
    fontSize: '$4',
})

export const SecondaryButtonText = styled(Button.Text, {
    name: 'SecondaryButtonText',
    color: '$accent9',
    fontWeight: '600',
    fontSize: '$4',
})

export const IconButton = styled(Button, {
    name: 'IconButton',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '$accent6',
    circular: true,
    animation: 'quick',

    hoverStyle: {
        backgroundColor: '$ctaBgHover',
        borderColor: '$accent7',
    },

    pressStyle: {
        opacity: 0.2,
        scale: 0.95,
    },

    focusStyle: {
        borderColor: '$accent8',
    },

    disabledStyle: {
        opacity: 0.5,
        pointerEvents: 'none',
        borderColor: '$accent4',
    },
})
