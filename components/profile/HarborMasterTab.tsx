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
    AlertCircle
} from '@tamagui/lucide-icons';
import {useTranslation, useToast} from '@/hooks/ui';
import * as ImagePicker from 'expo-image-picker';

import {Platform} from 'react-native';
import {useLocationInfo} from '@/hooks/data';
import {UpdateLocationRequest, DetailedLocationDTO} from '@/api/models/location';
import {UI_CONSTANTS} from '@/config/constants';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText} from '@/types/button';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HarborMasterTabProps {
    // Component manages its own location data
}

export const HarborMasterTab: React.FC<HarborMasterTabProps> = () => {
    const {t} = useTranslation();
    const toast = useToast();

    const {
        isHarborMaster,
        fetchLocationInfo,
        updateLocation,
        getImageUrl
    } = useLocationInfo();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [locationData, setLocationData] = useState<DetailedLocationDTO | null>(null);

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
    const maxImageSizeBytes = 5 * 1024 * 1024;

    // Fetch location info on mount
    useEffect(() => {
        void fetchLocationInfo(
            (data) => {
                setLocationData(data);
            },
            (error) => {
                toast.error(t('harbor.errorLoading'), {
                    message: t(error.onGetMessage())
                });
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // fetchLocationInfo is a hook function and changes on every render

    // Update edited info and fetch image when locationData changes
    useEffect(() => {
        if (!locationData) return;

        setEditedInfo({
            name: locationData.name || '',
            address: locationData.address || '',
            description: locationData.description || null,
            openingHours: locationData.openingHours || null,
            contact: locationData.contact || null,
            image: null
        });

        if (locationData.id) {
            void getImageUrl(
                locationData.id,
                (url) => {
                    setCurrentImageUrl(url);
                },
                (error) => {
                    toast.error(t('harbor.errorLoading'), {
                        message: t(error.onGetMessage())
                    });
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locationData]); // getImageUrl is a hook function and changes on every render

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
        if (!locationData) {
            setIsEditing(false);
            return;
        }
        setEditedInfo({
            name: locationData.name || '',
            address: locationData.address || '',
            description: locationData.description || null,
            openingHours: locationData.openingHours || null,
            contact: locationData.contact || null,
            image: null
        });
        setIsEditing(false);
        // Reset image URL to original
        if (locationData.id) {
            void getImageUrl(
                locationData.id,
                (url) => setCurrentImageUrl(url),
                (error) => {
                    toast.error(t('harbor.errorLoading'), {
                        message: t(error.onGetMessage())
                    });
                }
            );
        }
    };

    const handleSave = async () => {
        if (!locationData?.id) {
            toast.error(t('harbor.noPermission'), {
                message: t('harbor.noPermissionMessage'),
                duration: UI_CONSTANTS.TOAST_DURATION.LONG
            });
            return;
        }

        setIsSaving(true);

        // Actually call updateLocation to save changes
        void updateLocation(
            locationData.id,
            editedInfo,
            (updatedData) => {
                // Show success only AFTER successful save
                toast.success(t('harbor.saveSuccess'), {
                    message: t('harbor.infoUpdated')
                });
                setLocationData(updatedData);
                setImageKey(prev => prev + 1);
                setIsEditing(false);
                setIsSaving(false);
            },
            (error) => {
                const message = t(error.onGetMessage());
                toast.error(t('harbor.saveError'), {
                    message,
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG
                });
                setIsSaving(false);
            }
        );
    };

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error(t('harbor.invalidFileType'), {
                message: t('harbor.pleaseSelectImage'),
                duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM
            });
            return;
        }

        // Check file size (max 5MB)
        if (file.size > maxImageSizeBytes) {
            toast.error(t('harbor.fileTooLarge'), {
                message: t('harbor.maxFileSize')
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

            setEditedInfo((prev) => ({
                ...prev,
                image: {
                    base64: base64,
                    contentType: mimeType
                }
            }));

            // Update preview
            setCurrentImageUrl(dataUrl);

            toast.success(t('harbor.imageUploaded'), {
                message: file.name,
                duration: UI_CONSTANTS.TOAST_DURATION.SHORT
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

    const pickImageFromLibrary = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            toast.error(t('harbor.mediaPermissionDenied'), {
                message: t('harbor.mediaPermissionMessage')
            });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.85,
            base64: true
        });

        if (result.canceled) return;

        const asset = result.assets?.[0];
        if (!asset?.base64) {
            toast.error(t('harbor.invalidFileType'), {
                message: t('harbor.pleaseSelectImage')
            });
            return;
        }

        if (asset.fileSize && asset.fileSize > maxImageSizeBytes) {
            toast.error(t('harbor.fileTooLarge'), {
                message: t('harbor.maxFileSize')
            });
            return;
        }

        setEditedInfo((prev) => ({
            ...prev,
            image: {
                base64: asset.base64,
                contentType: asset.mimeType || 'image/jpeg'
            }
        }));
        setCurrentImageUrl(asset.uri);
        toast.success(t('harbor.imageUploaded'), {
            message: asset.fileName || ''
        });
    };

    const triggerFileInput = () => {
        if (Platform.OS === 'web' && fileInputRef.current) {
            fileInputRef.current.click();
            return;
        }
        if (Platform.OS !== 'web') {
            void pickImageFromLibrary();
        }
    };

    // Show loading state while fetching data
    if (!locationData) {
        return (
            <YStack flex={1} alignItems="center" justifyContent="center" padding="$8">
                <Spinner size="large" color="$accent7"/>
                <Text marginTop="$4" color="$gray11">{t('harbor.loading')}</Text>
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
                    {/* Header */}
                    <XStack
                        alignItems="center"
                        justifyContent="space-between"
                        flexWrap="wrap"
                        gap="$3"
                    >
                        <YStack flex={1} minWidth={220}>
                            <H4 color="$accent7" fontFamily="$oswald">
                                {displayData.name || t('harbor.manageHarbor')}
                            </H4>
                            <Text color="$gray11" fontSize="$2">
                                {t('harbor.manageDescription')}
                            </Text>
                        </YStack>
                        {!isEditing && (
                            <PrimaryButton
                                size="$3"
                                onPress={handleEdit}
                                disabled={isSaving}
                            >
                                <PrimaryButtonText>
                                    {t('profile.edit')}
                                </PrimaryButtonText>
                            </PrimaryButton>
                        )}
                    </XStack>

                {/* Harbor Image Section */}
                <Card backgroundColor="$content1" borderRadius="$6" padding="$5"
                      borderWidth={1} borderColor="$borderColor">
                    <YStack gap="$4">
                        <XStack alignItems="center" gap="$3">
                            <View
                                width={40}
                                height={40}
                                backgroundColor="$content2"
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
                                                <YStack width="100%" gap="$2">
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
                                                        backgroundColor="$content2"
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
                                                <YStack width="100%" gap="$2">
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
                                                        backgroundColor="$content2"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                    >
                                                        <FileImage size={40} color="$accent7"/>
                                                    </View>
                                                    <YStack alignItems="center" gap="$2">
                                                        <Text fontSize="$5" fontWeight="600" color="$color">
                                                            {t('harbor.tapToSelectImage')}
                                                        </Text>
                                                        <Button
                                                            size="$3"
                                                            variant="outlined"
                                                            onPress={triggerFileInput}
                                                        >
                                                            {t('harbor.changeImage')}
                                                        </Button>
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
                                backgroundColor="$content2"
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
                                backgroundColor="$content2"
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
                                backgroundColor="$content2"
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
                                backgroundColor="$content2"
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
                    <XStack gap="$3" justifyContent="flex-end" paddingBottom="$4" flexWrap="wrap">
                        <SecondaryButton
                            minWidth={120}
                            size="$4"
                            onPress={handleCancel}
                            disabled={isSaving}
                            icon={<X size={20}/>}
                        >
                            <SecondaryButtonText flexShrink={0} flexWrap="nowrap">
                                {t('profile.actions.cancel')}
                            </SecondaryButtonText>
                        </SecondaryButton>
                        <PrimaryButton
                            minWidth={180}
                            size="$4"
                            disabled={isSaving}
                            onPress={handleSave}
                            icon={isSaving ? <Spinner color="white"/> : <Save size={20}/>}
                        >
                            <PrimaryButtonText flexShrink={0} flexWrap="nowrap">
                                {isSaving ? t('profile.actions.saving') : t('profile.actions.saveChanges')}
                            </PrimaryButtonText>
                        </PrimaryButton>
                    </XStack>
                )}
            </YStack>
        </ScrollView>
    );
};
