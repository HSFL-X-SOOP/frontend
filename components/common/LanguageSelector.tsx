import React from 'react';
import {Button, YStack, XStack, Text} from 'tamagui';
import {useTranslation} from '@/hooks/ui';
import {useSession} from '@/context/SessionContext';
import {useUser} from '@/hooks/data';
import {Language} from '@/api/models/profile';

const languages = [
    {code: 'de', name: 'Deutsch', flag: '🇩🇪', profileLang: Language.DE},
    {code: 'en', name: 'English', flag: '🇬🇧', profileLang: Language.EN},
];

export const LanguageSelector: React.FC = () => {
    const {currentLanguage, changeLanguage} = useTranslation();
    const {session, updateProfile: updateSessionProfile} = useSession();
    const {updateProfile} = useUser();

    const handleLanguageChange = async (code: string, profileLang: Language) => {
        changeLanguage(code);

        if (session?.profile) {
            try {
                const updatedProfile = await updateProfile({
                    language: profileLang,
                    roles: session.profile.roles, // Backend erwartet 'roles'
                    measurementSystem: session.profile.measurementSystem
                });
                updateSessionProfile(updatedProfile);
            } catch (error) {
                console.error('Failed to update language in backend:', error);
            }
        }
    };

    return (
        <YStack gap="$3" padding="$2" minWidth={200}>
            {languages.map((language) => (
                <Button
                    key={language.code}
                    variant={currentLanguage === language.code ? "outlined" : undefined}
                    justifyContent="flex-start"
                    onPress={() => handleLanguageChange(language.code, language.profileLang)}
                >
                    <XStack alignItems="center" gap="$3" width="100%">
                        <Text fontSize={"$5"}>{language.flag}</Text>
                        <Text color="$color">{language.name}</Text>
                    </XStack>
                </Button>
            ))}
        </YStack>
    );
};

