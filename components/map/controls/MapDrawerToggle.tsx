import {List} from '@tamagui/lucide-icons';
import {Button, XStack} from 'tamagui';
import {Platform} from 'react-native';
import {useIsMobileWeb} from '@/hooks/ui';

interface MapDrawerToggleProps {
    onPress: () => void;
    isOpen?: boolean;
}

export default function MapDrawerToggle({onPress, isOpen = false}: MapDrawerToggleProps) {
    const isMobileWeb = useIsMobileWeb();
    const isNative = Platform.OS !== 'web';

    const shouldShowToggle = isNative || isMobileWeb;

    if (!shouldShowToggle) {
        return null; // Don't show on desktop web
    }

    return (
        <XStack
            position="absolute"
            top="$4"
            left="$4"
            zIndex={999}
            animation="quick"
        >
            <Button
                size="$4"
                circular
                backgroundColor="$background"
                borderColor="$accent8"
                borderWidth={2}
                onPress={onPress}
                shadowColor="$shadowColor"
                shadowOffset={{width: 0, height: 2}}
                shadowOpacity={0.25}
                shadowRadius={4}
                elevate
                animation="quick"
                hoverStyle={{
                    backgroundColor: "$backgroundHover",
                    borderColor: "$accent9"
                }}
                pressStyle={{
                    backgroundColor: "$backgroundPress",
                    borderColor: "$accent10",
                    scale: 0.95
                }}
            >
                <List size={20} color="$accent8" strokeWidth={2.5}/>
            </Button>

        </XStack>
    );
}
