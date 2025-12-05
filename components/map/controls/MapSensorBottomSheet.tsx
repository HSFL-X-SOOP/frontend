import {Sheet, YStack} from 'tamagui';
import {useSheet} from '@tamagui/sheet';
import {
    ReactNode,
    useState,
    useImperativeHandle,
    forwardRef,
    useEffect,
    useRef,
    useCallback
} from 'react';
import {Platform} from 'react-native';

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface SheetRef {
    setPosition?: (position: number) => void;
    setPositionImmediate?: (position: number) => void;
}

interface MapSensorBottomSheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
}

export interface MapSensorBottomSheetRef {
    snapToPeek: () => void;
}

// ==========================================
// CONSTANTS
// ==========================================
const SHEET_CONFIG = {
    snapPoints: [55, 17.5], // [expanded%, collapsed%]
    defaultPosition: 1,     // Start at collapsed position
    animationMode: 'medium' as const,
    throttleMs: 50,        // Min time between snap calls
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const MapSensorBottomSheet = forwardRef<MapSensorBottomSheetRef, MapSensorBottomSheetProps>(
    ({isOpen, onOpenChange, children}, ref) => {
        // ==========================================
        // STATE & REFS
        // ==========================================
        const [position, setPosition] = useState(SHEET_CONFIG.defaultPosition);
        const sheetRef = useRef<SheetRef>(null);
        const lastSnapTime = useRef(0);

        // ==========================================
        // SNAP TO PEEK FUNCTION
        // ==========================================
        const snapToPeek = useCallback(() => {
            // Throttle to prevent too frequent updates
            const now = Date.now();
            if (now - lastSnapTime.current < SHEET_CONFIG.throttleMs) {
                return;
            }
            lastSnapTime.current = now;

            // Update local state
            setPosition(SHEET_CONFIG.defaultPosition);

            // Use Tamagui's sheet hook if available
            const sheet = sheetRef.current;
            if (!sheet) return;

            // Platform-specific approach
            if (Platform.OS === 'web') {
                // Web handles animations better with regular setPosition
                sheet.setPosition?.(SHEET_CONFIG.defaultPosition);
            } else {
                // Native platforms need immediate update to avoid animation queue issues
                if (sheet.setPositionImmediate) {
                    sheet.setPositionImmediate(SHEET_CONFIG.defaultPosition);
                } else {
                    // Fallback to regular setPosition
                    sheet.setPosition?.(SHEET_CONFIG.defaultPosition);
                }
            }
        }, []);

        // ==========================================
        // EXPOSE METHODS TO PARENT
        // ==========================================
        useImperativeHandle(ref, () => ({
            snapToPeek
        }), [snapToPeek]);

        // ==========================================
        // AUTO-SNAP ON OPEN
        // ==========================================
        useEffect(() => {
            if (isOpen) {
                // When sheet opens, snap to peek position
                snapToPeek();
            }
        }, [isOpen, snapToPeek]);

        // ==========================================
        // SHEET HOOK INTEGRATION
        // ==========================================
        const SheetHookBridge = () => {
            const sheet = useSheet();

            // Store sheet reference for snapToPeek to use
            useEffect(() => {
                sheetRef.current = sheet;
            }, [sheet]);

            return null;
        };

        // ==========================================
        // RENDER
        // ==========================================
        return (
            <Sheet
                modal={false}
                open={isOpen}
                onOpenChange={onOpenChange}
                snapPoints={SHEET_CONFIG.snapPoints}
                snapPointsMode="percent"
                dismissOnSnapToBottom
                dismissOnOverlayPress={false}
                animation={SHEET_CONFIG.animationMode}
                zIndex={100000}
                defaultPosition={SHEET_CONFIG.defaultPosition}
                position={position}
                onPositionChange={setPosition}
                forceRemoveScrollEnabled={false}
            >
                {/* Bridge component to access sheet hook */}
                <SheetHookBridge />

                {/* Transparent overlay - no interaction blocking */}
                <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{opacity: 0}}
                    exitStyle={{opacity: 0}}
                    backgroundColor="$colorTransparent"
                    pointerEvents="none"
                    style={{pointerEvents: 'none'}}
                />

                {/* Draggable handle */}
                <Sheet.Handle
                    backgroundColor="$borderColor"
                    pointerEvents="auto"
                />

                {/* Sheet content */}
                <Sheet.Frame
                    padding="$0"
                    backgroundColor="$background"
                    borderTopLeftRadius="$6"
                    borderTopRightRadius="$6"
                >
                    <YStack flex={1}>
                        {children}
                    </YStack>
                </Sheet.Frame>
            </Sheet>
        );
    }
);

MapSensorBottomSheet.displayName = 'MapSensorBottomSheet';

export default MapSensorBottomSheet;