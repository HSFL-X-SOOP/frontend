import React from 'react';
import {YStack, XStack, Text} from 'tamagui';
import {useTranslation, useToast} from '@/hooks/ui';
import {useSession} from '@/context/SessionContext';
import {useUser} from '@/hooks/data';
import {Language} from '@/api/models/profile';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText} from '@/types/button';

const languages = [
    {code: 'de', name: 'Deutsch', flag: '🇩🇪', profileLang: Language.DE},
    {code: 'en', name: 'English', flag: '🇬🇧', profileLang: Language.EN},
];

export const LanguageSelector: React.FC = () => {
    const {currentLanguage, changeLanguage, t} = useTranslation();
    const toast = useToast();
    const {session, updateProfile: updateSessionProfile} = useSession();
    const {updateProfile} = useUser();

    const handleLanguageChange = async (code: string, profileLang: Language) => {
        changeLanguage(code);

        if (session?.profile) {
            await updateProfile(
                {
                    language: profileLang,
                },
                (updatedProfile) => {
                    updateSessionProfile(updatedProfile);
                },
                (error) => {
                    toast.error(t('settings.language'), {
                        message: t(error.onGetMessage())
                    });
                }
            );
        }
    };

    return (
        <YStack gap="$3" padding="$2" minWidth={200}>
            {languages.map((language) => {
                const ButtonComponent = currentLanguage === language.code ? PrimaryButton : SecondaryButton;
                const TextComponent = currentLanguage === language.code ? PrimaryButtonText : SecondaryButtonText;
                const TextFlagComponentColor = ButtonComponent === SecondaryButton ? "$accent9" : "white";
                return (
                    <ButtonComponent
                        key={language.code}
                        justifyContent="flex-start"
                        onPress={() => handleLanguageChange(language.code, language.profileLang)}
                    >
                        <XStack alignItems="center" gap="$3" width="100%">
                            <Text fontSize={"$5"} color={TextFlagComponentColor}>{language.flag}</Text>
                            <TextComponent >
                                {language.name}
                            </TextComponent>
                        </XStack>
                    </ButtonComponent>
                );
            })}
        </YStack>
    );
};
