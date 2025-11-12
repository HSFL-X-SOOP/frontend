import React, {useState, useRef, useEffect} from 'react';
import {
    YStack,
    XStack,
    Card,
    H4,
    H5,
    Text,
    Input,
    TextArea,
    Label,
    Button,
    Spinner,
    View,
    Image,
    ScrollView,
    Separator
} from 'tamagui';
import {
    Home,
    Clock,
    MapPin,
    Info,
    Image as ImageIcon,
    Save,
    X,
    Upload,
    FileImage,
    Phone,
    Mail,
    Globe,
    MessageCircle,
    RefreshCw,
    AlertCircle
} from '@tamagui/lucide-icons';
import {useTranslation} from '@/hooks/useTranslation';
import {useToast} from '@/components/useToast';
import {Platform} from 'react-native';
import {useLocationInfo} from '@/hooks/useLocationInfo';
import {UpdateLocationRequest, DetailedLocationDTO} from '@/api/models/location';

interface HarborMasterTabProps {
    initialLocationData?: DetailedLocationDTO | null;
    isLoadingInitial?: boolean;
}

export const HarborMasterTab: React.FC<HarborMasterTabProps> = ({
    initialLocationData,
    isLoadingInitial = false
}) => {
    const {t} = useTranslation();
    const toast = useToast();

    // Pass initial data to avoid duplicate API call
    const {
        locationData,
        locationId,
        isLoading,
        error,
        isHarborMaster,
        updateLocation,
        refetch,
        clearError,
        getImageUrl
    } = useLocationInfo(initialLocationData);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize edited info from API data
    const [editedInfo, setEditedInfo] = useState<UpdateLocationRequest>({
        name: '',
        address: '',
        description: null,
        openingHours: null,
        contact: null,
        image: null
    });

    // State for current image URL (either from API or uploaded)
    const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
    const [imageKey, setImageKey] = useState<number>(0);

    // Initialize editedInfo when locationData first loads
    useEffect(() => {
        if (locationData && !isEditing) {
            // Only set editedInfo if we're not currently editing
            // This prevents overwriting user changes
            setEditedInfo({
                name: locationData.name || '',
                address: locationData.address || '',
                description: locationData.description || null,
                openingHours: locationData.openingHours || null,
                contact: locationData.contact || null,
                image: null
            });

            // Set image URL using the helper function only when not editing
            if (getImageUrl) {
                setCurrentImageUrl(getImageUrl());
            }
        }
    }, [locationData, getImageUrl, isEditing]);

    const handleEdit = () => {
        if (locationData) {
            setEditedInfo({
                name: locationData.name || '',
                address: locationData.address || '',
                description: locationData.description || null,
                openingHours: locationData.openingHours || null,
                contact: locationData.contact || null,
                image: null
            });
        }
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (locationData) {
            setEditedInfo({
                name: locationData.name || '',
                address: locationData.address || '',
                description: locationData.description || null,
                openingHours: locationData.openingHours || null,
                contact: locationData.contact || null,
                image: null
            });
        }
        setIsEditing(false);
        // Reset image URL to original
        if (getImageUrl) {
            setCurrentImageUrl(getImageUrl());
        }
    };

    const handleSave = async () => {
        if (!updateLocation) {
            toast.error(t('harbor.noPermission'), {
                message: t('harbor.noPermissionMessage'),
                duration: 5000
            });
            return;
        }

        setIsSaving(true);
        try {
            // Debug log to see what we're sending
            console.log('Updating location with data:', {
                ...editedInfo,
                image: editedInfo.image ? {
                    hasBase64: !!editedInfo.image.base64,
                    contentType: editedInfo.image.contentType
                } : null
            });

            const result = await updateLocation(editedInfo);

            if (!result) throw new Error('Update failed');

            toast.success(t('harbor.saveSuccess'), {
                message: t('harbor.infoUpdated'),
                duration: 3000
            });

            // Refresh data to get updated info
            if (refetch) {
                await refetch();
            }

            // Increment imageKey to force image reload from server
            setImageKey(prev => prev + 1);

            // Set isEditing to false - useEffect will handle updating currentImageUrl
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save harbor info:', error);
            toast.error(t('harbor.saveError'), {
                message: t('harbor.saveErrorMessage'),
                duration: 5000
            });
        } finally {
            setIsSaving(false);
        }
    };

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error(t('harbor.invalidFileType'), {
                message: t('harbor.pleaseSelectImage'),
                duration: 3000
            });
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error(t('harbor.fileTooLarge'), {
                message: t('harbor.maxFileSize'),
                duration: 3000
            });
            return;
        }

        // Read file and convert to base64
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            // Extract base64 string from data URL
            const base64 = dataUrl.split(',')[1];
            const mimeType = dataUrl.split(':')[1].split(';')[0];

            setEditedInfo({
                ...editedInfo,
                image: {
                    base64: base64,
                    contentType: mimeType
                }
            });

            // Update preview
            setCurrentImageUrl(dataUrl);

            toast.success(t('harbor.imageUploaded'), {
                message: file.name,
                duration: 2000
            });
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        if (Platform.OS === 'web' && isEditing) {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        if (Platform.OS === 'web' && isEditing) {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        if (Platform.OS === 'web' && isEditing) {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                processFile(files[0]);
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };

    const triggerFileInput = () => {
        if (Platform.OS === 'web' && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRefresh = async () => {
        if (refetch) {
            clearError();
            await refetch();
        }
    };

    // Show loading state (either initial loading from profile or refetch)
    if ((isLoadingInitial || isLoading) && !locationData) {
        return (
            <YStack flex={1} alignItems="center" justifyContent="center" padding="$8">
                <Spinner size="large" color="$accent7"/>
                <Text marginTop="$4" color="$gray11">{t('harbor.loading')}</Text>
            </YStack>
        );
    }

    // Show error state
    if (error && !locationData) {
        return (
            <YStack flex={1} alignItems="center" justifyContent="center" padding="$8" gap="$4">
                <AlertCircle size={48} color="$red10"/>
                <Text fontSize="$5" fontWeight="600" color="$color">{t('harbor.errorLoading')}</Text>
                <Text color="$gray11" textAlign="center">{error}</Text>
                <Button
                    size="$3"
                    backgroundColor="$accent7"
                    color="white"
                    onPress={handleRefresh}
                    icon={<RefreshCw size={20}/>}
                >
                    {t('harbor.retry')}
                </Button>
            </YStack>
        );
    }

    // Show no permission state
    if (!isHarborMaster) {
        return (
            <YStack flex={1} alignItems="center" justifyContent="center" padding="$8" gap="$4">
                <AlertCircle size={48} color="$orange10"/>
                <Text fontSize="$5" fontWeight="600" color="$color">{t('harbor.noAccess')}</Text>
                <Text color="$gray11" textAlign="center">{t('harbor.noAccessMessage')}</Text>
            </YStack>
        );
    }

    // Use locationData if available, otherwise use defaults
    const displayData = locationData || {
        name: '',
        address: '',
        openingHours: '',
        description: '',
        contact: null
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <YStack gap="$4">
                {/* Header with Edit Button */}
                <XStack justifyContent="space-between" alignItems="center">
                    <YStack>
                        <H4 color="$accent7" fontFamily="$oswald">
                            {displayData.name || t('harbor.manageHarbor')}
                        </H4>
                        <Text color="$gray11" fontSize="$2">
                            {t('harbor.manageDescription')}
                        </Text>
                    </YStack>
                    <XStack gap="$2">
                        {error && (
                            <Button
                                size="$3"
                                variant="outlined"
                                onPress={handleRefresh}
                                icon={<RefreshCw size={18}/>}
                            >
                                {t('harbor.retry')}
                            </Button>
                        )}
                        {!isEditing && (
                            <Button
                                size="$3"
                                backgroundColor="$accent7"
                                color="white"
                                pressStyle={{backgroundColor: "$accent6"}}
                                hoverStyle={{backgroundColor: "$accent4"}}
                                onPress={handleEdit}
                                disabled={isLoading}
                            >
                                {t('profile.edit')}
                            </Button>
                        )}
                    </XStack>
                </XStack>

                {/* Harbor Image Section */}
                <Card backgroundColor="$content1" borderRadius="$6" padding="$5"
                      borderWidth={1} borderColor="$borderColor">
                    <YStack gap="$4">
                        <XStack alignItems="center" gap="$3">
                            <View
                                width={40}
                                height={40}
                                backgroundColor="$accent2"
                                borderRadius="$8"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <ImageIcon size={22} color="$accent7"/>
                            </View>
                            <H5 color="$accent7" fontFamily="$oswald">
                                {t('harbor.image')}
                            </H5>
                        </XStack>
                        <Separator/>

                        <YStack gap="$3">
                            {Platform.OS === 'web' && (
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    style={{display: 'none'}}
                                />
                            )}

                            {isEditing ? (
                                <YStack gap="$3">
                                    {Platform.OS === 'web' ? (
                                        <div
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            onClick={triggerFileInput}
                                            style={{
                                                border: `2px ${isDragging ? 'solid' : 'dashed'} ${isDragging ? 'var(--color7)' : 'var(--borderColor)'}`,
                                                backgroundColor: isDragging ? 'var(--color1)' : 'var(--background)',
                                                borderRadius: 'var(--radius-4)',
                                                padding: 'var(--space-4)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '200px',
                                                cursor: 'pointer',
                                                transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                        {currentImageUrl ? (
                                            <YStack width="100%" height="100%" gap="$2">
                                                <Image
                                                    key={imageKey}
                                                    source={{uri: currentImageUrl}}
                                                    width="100%"
                                                    height={160}
                                                    borderRadius="$3"
                                                    resizeMode="cover"
                                                />
                                                <Button
                                                    size="$2"
                                                    variant="outlined"
                                                    onPress={(e) => {
                                                        e.stopPropagation();
                                                        triggerFileInput();
                                                    }}
                                                    icon={<Upload size={16}/>}
                                                >
                                                    {t('harbor.changeImage')}
                                                </Button>
                                            </YStack>
                                        ) : (
                                            <YStack alignItems="center" gap="$3">
                                                <View
                                                    width={80}
                                                    height={80}
                                                    borderRadius="$10"
                                                    backgroundColor="$accent2"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <FileImage size={40} color="$accent7"/>
                                                </View>
                                                <YStack alignItems="center" gap="$2">
                                                    <Text fontSize="$5" fontWeight="600" color="$color">
                                                        {t('harbor.dragDropImage')}
                                                    </Text>
                                                    <Text fontSize="$3" color="$gray11">
                                                        {t('harbor.orClickToSelect')}
                                                    </Text>
                                                    <Text fontSize="$2" color="$gray10">
                                                        {t('harbor.maxSizeInfo')}
                                                    </Text>
                                                </YStack>
                                            </YStack>
                                        )}
                                        </div>
                                    ) : (
                                        <View
                                            borderWidth={2}
                                            borderStyle="dashed"
                                            borderColor="$borderColor"
                                            backgroundColor="$background"
                                            borderRadius="$4"
                                            padding="$4"
                                            alignItems="center"
                                            justifyContent="center"
                                            minHeight={200}
                                            onPress={triggerFileInput}
                                        >
                                        {currentImageUrl ? (
                                            <YStack width="100%" height="100%" gap="$2">
                                                <Image
                                                    key={imageKey}
                                                    source={{uri: currentImageUrl}}
                                                    width="100%"
                                                    height={160}
                                                    borderRadius="$3"
                                                    resizeMode="cover"
                                                />
                                                <Button
                                                    size="$2"
                                                    variant="outlined"
                                                    onPress={(e) => {
                                                        e.stopPropagation();
                                                        triggerFileInput();
                                                    }}
                                                    icon={<Upload size={16}/>}
                                                >
                                                    {t('harbor.changeImage')}
                                                </Button>
                                            </YStack>
                                        ) : (
                                            <YStack alignItems="center" gap="$3">
                                                <View
                                                    width={80}
                                                    height={80}
                                                    borderRadius="$10"
                                                    backgroundColor="$accent2"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <FileImage size={40} color="$accent7"/>
                                                </View>
                                                <YStack alignItems="center" gap="$2">
                                                    <Text fontSize="$5" fontWeight="600" color="$color">
                                                        {t('harbor.tapToSelectImage')}
                                                    </Text>
                                                    <Text fontSize="$2" color="$gray10">
                                                        {t('harbor.maxSizeInfo')}
                                                    </Text>
                                                </YStack>
                                            </YStack>
                                        )}
                                        </View>
                                    )}
                                </YStack>
                            ) : (
                                <Image
                                    key={imageKey}
                                    source={{uri: currentImageUrl}}
                                    width="100%"
                                    height={200}
                                    borderRadius="$4"
                                    resizeMode="cover"
                                />
                            )}
                        </YStack>
                    </YStack>
                </Card>

                {/* Basic Information */}
                <Card backgroundColor="$content1" borderRadius="$6" padding="$5"
                      borderWidth={1} borderColor="$borderColor">
                    <YStack gap="$4">
                        <XStack alignItems="center" gap="$3">
                            <View
                                width={40}
                                height={40}
                                backgroundColor="$accent2"
                                borderRadius="$8"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Home size={22} color="$accent7"/>
                            </View>
                            <H5 color="$accent7" fontFamily="$oswald">
                                {t('harbor.basicInfo')}
                            </H5>
                        </XStack>
                        <Separator/>

                        <YStack gap="$3">
                            <YStack gap="$2">
                                <Label htmlFor="harbor-name" color="$color" fontSize="$3">
                                    {t('harbor.name')}
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="harbor-name"
                                        value={editedInfo.name}
                                        onChangeText={(text) => setEditedInfo({...editedInfo, name: text})}
                                        placeholder={t('harbor.namePlaceholder')}
                                        backgroundColor="$background"
                                        borderColor="$borderColor"
                                    />
                                ) : (
                                    <Text color="$color" fontSize="$4" paddingLeft="$2">
                                        {displayData.name || '-'}
                                    </Text>
                                )}
                            </YStack>

                            <YStack gap="$2">
                                <XStack gap="$2" alignItems="center">
                                    <MapPin size={16} color="$gray10"/>
                                    <Label htmlFor="harbor-address" color="$color" fontSize="$3">
                                        {t('dashboard.address')}
                                    </Label>
                                </XStack>
                                {isEditing ? (
                                    <Input
                                        id="harbor-address"
                                        value={editedInfo.address}
                                        onChangeText={(text) => setEditedInfo({...editedInfo, address: text})}
                                        placeholder={t('harbor.addressPlaceholder')}
                                        backgroundColor="$background"
                                        borderColor="$borderColor"
                                    />
                                ) : (
                                    <Text color="$color" fontSize="$4" paddingLeft="$2">
                                        {displayData.address || '-'}
                                    </Text>
                                )}
                            </YStack>
                        </YStack>
                    </YStack>
                </Card>

                <Card backgroundColor="$content1" borderRadius="$6" padding="$5"
                      borderWidth={1} borderColor="$borderColor">
                    <YStack gap="$4">
                        <XStack alignItems="center" gap="$3">
                            <View
                                width={40}
                                height={40}
                                backgroundColor="$accent2"
                                borderRadius="$8"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Clock size={22} color="$accent7"/>
                            </View>
                            <H5 color="$accent7" fontFamily="$oswald">
                                {t('dashboard.openingHours')}
                            </H5>
                        </XStack>
                        <Separator/>

                        {isEditing ? (
                            <TextArea
                                value={editedInfo.openingHours || ''}
                                onChangeText={(text) => setEditedInfo({...editedInfo, openingHours: text})}
                                placeholder={t('harbor.openingHoursPlaceholder')}
                                backgroundColor="$background"
                                borderColor="$borderColor"
                                minHeight={100}
                            />
                        ) : (
                            <Text color="$color" fontSize="$4" paddingLeft="$2" whiteSpace="pre-line">
                                {displayData.openingHours || '-'}
                            </Text>
                        )}
                    </YStack>
                </Card>

                <Card backgroundColor="$content1" borderRadius="$6" padding="$5"
                      borderWidth={1} borderColor="$borderColor">
                    <YStack gap="$4">
                        <XStack alignItems="center" gap="$3">
                            <View
                                width={40}
                                height={40}
                                backgroundColor="$accent2"
                                borderRadius="$8"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Info size={22} color="$accent7"/>
                            </View>
                            <H5 color="$accent7" fontFamily="$oswald">
                                {t('harbor.description')}
                            </H5>
                        </XStack>
                        <Separator/>

                        {isEditing ? (
                            <TextArea
                                value={editedInfo.description || ''}
                                onChangeText={(text) => setEditedInfo({...editedInfo, description: text})}
                                placeholder={t('harbor.descriptionPlaceholder')}
                                backgroundColor="$background"
                                borderColor="$borderColor"
                                minHeight={120}
                            />
                        ) : (
                            <Text color="$color" fontSize="$4" paddingLeft="$2">
                                {displayData.description || '-'}
                            </Text>
                        )}
                    </YStack>
                </Card>

                <Card backgroundColor="$content1" borderRadius="$6" padding="$5"
                      borderWidth={1} borderColor="$borderColor">
                    <YStack gap="$4">
                        <XStack alignItems="center" gap="$3">
                            <View
                                width={40}
                                height={40}
                                backgroundColor="$accent2"
                                borderRadius="$8"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <MessageCircle size={22} color="$accent7"/>
                            </View>
                            <H5 color="$accent7" fontFamily="$oswald">
                                {t('harbor.contactInfo')}
                            </H5>
                        </XStack>
                        <Separator/>

                        <YStack gap="$3">
                            <YStack gap="$2">
                                <XStack gap="$2" alignItems="center">
                                    <Phone size={16} color="$gray10"/>
                                    <Label htmlFor="harbor-phone" color="$color" fontSize="$3">
                                        {t('harbor.phone')}
                                    </Label>
                                </XStack>
                                {isEditing ? (
                                    <Input
                                        id="harbor-phone"
                                        value={editedInfo.contact?.phone || ''}
                                        onChangeText={(text) => setEditedInfo({
                                            ...editedInfo,
                                            contact: {...editedInfo.contact, phone: text}
                                        })}
                                        placeholder={t('harbor.phonePlaceholder')}
                                        backgroundColor="$background"
                                        borderColor="$borderColor"
                                        keyboardType="phone-pad"
                                    />
                                ) : (
                                    <Text color="$color" fontSize="$4" paddingLeft="$2">
                                        {displayData.contact?.phone || '-'}
                                    </Text>
                                )}
                            </YStack>

                            <YStack gap="$2">
                                <XStack gap="$2" alignItems="center">
                                    <Mail size={16} color="$gray10"/>
                                    <Label htmlFor="harbor-email" color="$color" fontSize="$3">
                                        {t('harbor.email')}
                                    </Label>
                                </XStack>
                                {isEditing ? (
                                    <Input
                                        id="harbor-email"
                                        value={editedInfo.contact?.email || ''}
                                        onChangeText={(text) => setEditedInfo({
                                            ...editedInfo,
                                            contact: {...editedInfo.contact, email: text}
                                        })}
                                        placeholder={t('harbor.emailPlaceholder')}
                                        backgroundColor="$background"
                                        borderColor="$borderColor"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                ) : (
                                    <Text color="$color" fontSize="$4" paddingLeft="$2">
                                        {displayData.contact?.email || '-'}
                                    </Text>
                                )}
                            </YStack>

                            <YStack gap="$2">
                                <XStack gap="$2" alignItems="center">
                                    <Globe size={16} color="$gray10"/>
                                    <Label htmlFor="harbor-website" color="$color" fontSize="$3">
                                        {t('harbor.website')}
                                    </Label>
                                </XStack>
                                {isEditing ? (
                                    <Input
                                        id="harbor-website"
                                        value={editedInfo.contact?.website || ''}
                                        onChangeText={(text) => setEditedInfo({
                                            ...editedInfo,
                                            contact: {...editedInfo.contact, website: text}
                                        })}
                                        placeholder={t('harbor.websitePlaceholder')}
                                        backgroundColor="$background"
                                        borderColor="$borderColor"
                                        autoCapitalize="none"
                                    />
                                ) : (
                                    <Text color="$color" fontSize="$4" paddingLeft="$2">
                                        {displayData.contact?.website || '-'}
                                    </Text>
                                )}
                            </YStack>
                        </YStack>
                    </YStack>
                </Card>

                {isEditing && (
                    <XStack gap="$3" justifyContent="flex-end" paddingBottom="$4">
                        <Button
                            flex={1}
                            size="$4"
                            backgroundColor="$content2"
                            color="$color"
                            borderWidth={1}
                            borderColor="$borderColor"
                            pressStyle={{backgroundColor: "$content3"}}
                            hoverStyle={{backgroundColor: "$content1"}}
                            onPress={handleCancel}
                            disabled={isSaving}
                            icon={<X size={20}/>}
                        >
                            {t('profile.actions.cancel')}
                        </Button>
                        <Button
                            flex={1}
                            size="$4"
                            backgroundColor="$accent7"
                            color="white"
                            pressStyle={{backgroundColor: "$accent6"}}
                            hoverStyle={{backgroundColor: "$accent4"}}
                            disabled={isSaving}
                            opacity={isSaving ? 0.6 : 1}
                            onPress={handleSave}
                            icon={isSaving ? <Spinner color="white"/> : <Save size={20}/>}
                        >
                            {isSaving ? t('profile.actions.saving') : t('profile.actions.saveChanges')}
                        </Button>
                    </XStack>
                )}
            </YStack>
        </ScrollView>
    );
};