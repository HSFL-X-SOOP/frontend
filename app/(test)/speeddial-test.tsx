import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  H2,
  H3,
  Separator,
  ScrollView,
  Button,
  useTheme,
  RadioGroup,
  Label,
  Switch,
  View,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SpeedDial, SpeedDialPlacement } from '@/components/speeddial';
import {
  Plus,
  Camera,
  Mail,
  FolderPlus,
  Share2,
  Download,
  Upload,
  Edit,
  Trash2,
  Settings,
  Heart,
  Star,
  X,
  MoreVertical,
  Navigation,
  Map,
  Filter,
  List,
  Home,
  User,
  Bell,
  Search,
  MessageCircle,
  Bookmark,
  Send,
  Calendar,
  Clock,
  ChevronUp,
} from '@tamagui/lucide-icons';
import { useToast } from '@/components/useToast';
import { Alert } from 'react-native';

export default function SpeedDialTestScreen() {
  const theme = useTheme();
  const toast = useToast();

  // Configuration states
  const [placement, setPlacement] = useState<SpeedDialPlacement>('bottom-right');
  const [variant, setVariant] = useState<'default' | 'minimal' | 'extended' | 'map'>('default');
  const [isControlled, setIsControlled] = useState(false);
  const [controlledOpen, setControlledOpen] = useState(false);
  const [labelPlacement, setLabelPlacement] = useState<'left' | 'right' | 'top' | 'bottom' | 'none'>('left');
  const [closeOnAction, setCloseOnAction] = useState(true);
  const [usePortal, setUsePortal] = useState(true);
  const [fabSize, setFabSize] = useState<'$4' | '$5' | '$6' | '$7'>('$6');
  const [gap, setGap] = useState<'$1' | '$2' | '$3' | '$4'>('$2');
  const [actionCount, setActionCount] = useState(4);

  const handleAction = (actionName: string) => {
    toast.info(`${actionName} clicked`, {
      message: `Action "${actionName}" was triggered`,
      duration: 2000,
    });

    // Optional: Show native alert for testing
    if (variant === 'extended') {
      Alert.alert('Action Triggered', `You clicked: ${actionName}`);
    }
  };

  // Generate dynamic actions based on count
  const generateActions = (count: number) => {
    const allActions = [
      { key: 'mail', label: 'Send Email', icon: Mail, color: '$blue10', bg: '$blue2' },
      { key: 'camera', label: 'Camera', icon: Camera, color: '$purple10', bg: '$purple2' },
      { key: 'folder', label: 'New Folder', icon: FolderPlus, color: '$green10', bg: '$green2' },
      { key: 'share', label: 'Share', icon: Share2, color: '$orange10', bg: '$orange2' },
      { key: 'download', label: 'Download', icon: Download, color: '$cyan10', bg: '$cyan2' },
      { key: 'upload', label: 'Upload', icon: Upload, color: '$pink10', bg: '$pink2' },
      { key: 'edit', label: 'Edit', icon: Edit, color: '$yellow10', bg: '$yellow2' },
      { key: 'trash', label: 'Delete', icon: Trash2, color: '$red10', bg: '$red2' },
    ];

    return allActions.slice(0, count).map(action => ({
      ...action,
      onPress: () => handleAction(action.label),
      ...(variant === 'extended' ? { colorToken: action.color, bgToken: action.bg } : {}),
    }));
  };

  // Default variant actions
  const defaultActions = generateActions(actionCount);

  // Minimal variant actions (no labels)
  const minimalActions = [
    { key: 'edit', icon: Edit, onPress: () => handleAction('Edit'), accessibilityLabel: 'Edit' },
    { key: 'trash', icon: Trash2, onPress: () => handleAction('Delete'), accessibilityLabel: 'Delete' },
    { key: 'download', icon: Download, onPress: () => handleAction('Download'), accessibilityLabel: 'Download' },
  ];

  // Extended variant with colors and disabled state
  const extendedActions = [
    {
      key: 'favorite',
      label: 'Favorites',
      icon: Heart,
      onPress: () => handleAction('Favorite'),
      colorToken: '$red10',
      bgToken: '$red2',
    },
    {
      key: 'star',
      label: 'Rate',
      icon: Star,
      onPress: () => handleAction('Rate'),
      colorToken: '$yellow10',
      bgToken: '$yellow2',
    },
    {
      key: 'message',
      label: 'Message',
      icon: MessageCircle,
      onPress: () => handleAction('Message'),
      colorToken: '$blue10',
      bgToken: '$blue2',
    },
    {
      key: 'bookmark',
      label: 'Bookmark',
      icon: Bookmark,
      onPress: () => handleAction('Bookmark'),
      colorToken: '$green10',
      bgToken: '$green2',
    },
    {
      key: 'settings',
      label: 'Settings (Disabled)',
      icon: Settings,
      onPress: () => handleAction('Settings'),
      disabled: true,
    },
  ];

  // Map-specific actions
  const mapActions = [
    { key: 'list', label: 'Sensor List', icon: List, onPress: () => handleAction('Sensor List') },
    { key: 'filter', label: 'Filter', icon: Filter, onPress: () => handleAction('Filter') },
    { key: 'navigation', label: 'Navigate', icon: Navigation, onPress: () => handleAction('Navigate') },
    { key: 'home', label: 'Home', icon: Home, onPress: () => handleAction('Home') },
  ];

  const getActionsForVariant = () => {
    switch (variant) {
      case 'minimal':
        return minimalActions;
      case 'extended':
        return extendedActions;
      case 'map':
        return mapActions;
      default:
        return defaultActions;
    }
  };

  const getIconForVariant = () => {
    switch (variant) {
      case 'minimal':
        return MoreVertical;
      case 'map':
        return Map;
      default:
        return Plus;
    }
  };

  const getActiveIconForVariant = () => {
    switch (variant) {
      case 'minimal':
        return X;
      case 'map':
        return ChevronUp;
      default:
        return X;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView>
        <YStack flex={1} padding="$4" gap="$4" backgroundColor="$background">
          <H2>SpeedDial Test Page</H2>

          {/* Main Configuration Card */}
          <Card elevate bordered padding="$4" backgroundColor="$background">
            <H3 marginBottom="$3">Configuration</H3>

            <YStack gap="$4">
              {/* Variant Selection */}
              <YStack gap="$2">
                <Label htmlFor="variant">Variant</Label>
                <RadioGroup
                  id="variant"
                  value={variant}
                  onValueChange={(value) => setVariant(value as any)}
                >
                  <XStack gap="$3" flexWrap="wrap">
                    {(['default', 'minimal', 'extended', 'map'] as const).map((v) => (
                      <XStack key={v} gap="$2" alignItems="center">
                        <RadioGroup.Item value={v} id={v}>
                          <RadioGroup.Indicator />
                        </RadioGroup.Item>
                        <Label htmlFor={v}>{v}</Label>
                      </XStack>
                    ))}
                  </XStack>
                </RadioGroup>
              </YStack>

              <Separator />

              {/* Placement Control */}
              <YStack gap="$2">
                <Label htmlFor="placement">Placement</Label>
                <RadioGroup
                  id="placement"
                  value={placement}
                  onValueChange={(value) => setPlacement(value as SpeedDialPlacement)}
                >
                  <XStack gap="$3" flexWrap="wrap">
                    {(['bottom-right', 'bottom-left', 'top-right', 'top-left'] as const).map((p) => (
                      <XStack key={p} gap="$2" alignItems="center">
                        <RadioGroup.Item value={p} id={p}>
                          <RadioGroup.Indicator />
                        </RadioGroup.Item>
                        <Label htmlFor={p}>{p}</Label>
                      </XStack>
                    ))}
                  </XStack>
                </RadioGroup>
              </YStack>

              <Separator />

              {/* Label Placement */}
              <YStack gap="$2">
                <Label htmlFor="labelPlacement">Label Placement</Label>
                <RadioGroup
                  id="labelPlacement"
                  value={labelPlacement}
                  onValueChange={(value) => setLabelPlacement(value as any)}
                >
                  <XStack gap="$3" flexWrap="wrap">
                    {(['left', 'right', 'top', 'bottom', 'none'] as const).map((lp) => (
                      <XStack key={lp} gap="$2" alignItems="center">
                        <RadioGroup.Item value={lp} id={lp}>
                          <RadioGroup.Indicator />
                        </RadioGroup.Item>
                        <Label htmlFor={lp}>{lp}</Label>
                      </XStack>
                    ))}
                  </XStack>
                </RadioGroup>
              </YStack>

              <Separator />

              {/* Size Controls */}
              <XStack gap="$4">
                <YStack flex={1} gap="$2">
                  <Label htmlFor="fabSize">FAB Size</Label>
                  <RadioGroup
                    id="fabSize"
                    value={fabSize}
                    onValueChange={(value) => setFabSize(value as any)}
                  >
                    <XStack gap="$2" flexWrap="wrap">
                      {(['$4', '$5', '$6', '$7'] as const).map((size) => (
                        <XStack key={size} gap="$1" alignItems="center">
                          <RadioGroup.Item value={size} id={`size-${size}`}>
                            <RadioGroup.Indicator />
                          </RadioGroup.Item>
                          <Label htmlFor={`size-${size}`} fontSize="$2">{size}</Label>
                        </XStack>
                      ))}
                    </XStack>
                  </RadioGroup>
                </YStack>

                <YStack flex={1} gap="$2">
                  <Label htmlFor="gap">Gap</Label>
                  <RadioGroup
                    id="gap"
                    value={gap}
                    onValueChange={(value) => setGap(value as any)}
                  >
                    <XStack gap="$2" flexWrap="wrap">
                      {(['$1', '$2', '$3', '$4'] as const).map((g) => (
                        <XStack key={g} gap="$1" alignItems="center">
                          <RadioGroup.Item value={g} id={`gap-${g}`}>
                            <RadioGroup.Indicator />
                          </RadioGroup.Item>
                          <Label htmlFor={`gap-${g}`} fontSize="$2">{g}</Label>
                        </XStack>
                      ))}
                    </XStack>
                  </RadioGroup>
                </YStack>
              </XStack>

              <Separator />

              {/* Action Count (for default variant) */}
              {variant === 'default' && (
                <>
                  <YStack gap="$2">
                    <Label>Action Count: {actionCount}</Label>
                    <XStack gap="$2">
                      {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                        <Button
                          key={count}
                          size="$2"
                          variant={actionCount === count ? undefined : 'outlined'}
                          onPress={() => setActionCount(count)}
                        >
                          {count}
                        </Button>
                      ))}
                    </XStack>
                  </YStack>
                  <Separator />
                </>
              )}

              {/* Behavior Controls */}
              <YStack gap="$3">
                <XStack justifyContent="space-between" alignItems="center">
                  <Label htmlFor="closeOnAction">Close on Action Press</Label>
                  <Switch
                    id="closeOnAction"
                    checked={closeOnAction}
                    onCheckedChange={setCloseOnAction}
                  />
                </XStack>

                <XStack justifyContent="space-between" alignItems="center">
                  <Label htmlFor="usePortal">Use Portal</Label>
                  <Switch
                    id="usePortal"
                    checked={usePortal}
                    onCheckedChange={setUsePortal}
                  />
                </XStack>

                <XStack justifyContent="space-between" alignItems="center">
                  <Label htmlFor="controlled">Controlled Mode</Label>
                  <Switch
                    id="controlled"
                    checked={isControlled}
                    onCheckedChange={setIsControlled}
                  />
                </XStack>

                {isControlled && (
                  <Button
                    onPress={() => setControlledOpen(!controlledOpen)}
                    variant={controlledOpen ? undefined : 'outlined'}
                  >
                    {controlledOpen ? 'Close' : 'Open'} SpeedDial
                  </Button>
                )}
              </YStack>
            </YStack>
          </Card>

          {/* Information Cards */}
          <XStack gap="$4" flexWrap="wrap">
            <Card flex={1} minWidth={250} elevate bordered padding="$4">
              <H3 marginBottom="$2" fontSize="$5">Current Config</H3>
              <YStack gap="$1">
                <Text fontSize="$2">Variant: <Text fontWeight="bold">{variant}</Text></Text>
                <Text fontSize="$2">Placement: <Text fontWeight="bold">{placement}</Text></Text>
                <Text fontSize="$2">Labels: <Text fontWeight="bold">{labelPlacement}</Text></Text>
                <Text fontSize="$2">FAB Size: <Text fontWeight="bold">{fabSize}</Text></Text>
                <Text fontSize="$2">Gap: <Text fontWeight="bold">{gap}</Text></Text>
                <Text fontSize="$2">Actions: <Text fontWeight="bold">{getActionsForVariant().length}</Text></Text>
                <Text fontSize="$2">Mode: <Text fontWeight="bold">{isControlled ? 'Controlled' : 'Uncontrolled'}</Text></Text>
              </YStack>
            </Card>

            <Card flex={1} minWidth={250} elevate bordered padding="$4">
              <H3 marginBottom="$2" fontSize="$5">Features Active</H3>
              <YStack gap="$1">
                <Text fontSize="$2">✅ Animations</Text>
                <Text fontSize="$2">✅ Staggered delays</Text>
                <Text fontSize="$2">{closeOnAction ? '✅' : '❌'} Close on action</Text>
                <Text fontSize="$2">{usePortal ? '✅' : '❌'} Portal rendering</Text>
                <Text fontSize="$2">✅ Accessibility</Text>
                <Text fontSize="$2">✅ Back button handler</Text>
                <Text fontSize="$2">✅ Theme support</Text>
              </YStack>
            </Card>
          </XStack>

          {/* Test Instructions */}
          <Card elevate bordered padding="$4" backgroundColor="$blue2">
            <H3 marginBottom="$2" fontSize="$5" color="$blue10">Test Instructions</H3>
            <YStack gap="$2">
              <Text fontSize="$3">1. Try different variants to see various use cases</Text>
              <Text fontSize="$3">2. Change placement to test positioning</Text>
              <Text fontSize="$3">3. Adjust label placement for different layouts</Text>
              <Text fontSize="$3">4. Test controlled mode for external state management</Text>
              <Text fontSize="$3">5. On Android: Test back button when menu is open</Text>
              <Text fontSize="$3">6. Tap outside menu to close it</Text>
              <Text fontSize="$3">7. Try different action counts (default variant)</Text>
            </YStack>
          </Card>

          {/* Add padding at bottom */}
          <View height={120} />
        </YStack>
      </ScrollView>

      {/* SpeedDial Component */}
      <SpeedDial
        placement={placement}
        labelPlacement={labelPlacement}
        actions={getActionsForVariant()}
        icon={getIconForVariant()}
        activeIcon={getActiveIconForVariant()}
        fabSize={fabSize as any}
        gap={gap as any}
        closeOnActionPress={closeOnAction}
        portal={usePortal}
        {...(isControlled ? {
          open: controlledOpen,
          onOpenChange: setControlledOpen,
        } : {})}
      />
    </SafeAreaView>
  );
}