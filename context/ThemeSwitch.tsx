import React, {createContext, useContext, useState, useEffect} from 'react';
import {TouchableOpacity, useColorScheme, Platform} from 'react-native';
import {MoonFilledIcon, SunFilledIcon} from "@/components/ui/Icons.tsx";
import {useLocalStorage} from '@/hooks/ui';

type ThemeContextType = {
    isDark: boolean;
    toggleTheme: () => void;
    currentTheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextType | null>(null);
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const systemTheme = useColorScheme();
    const STORAGE_KEY = 'theme';
    const isWeb = Platform.OS === 'web';
    const [storedTheme, setStoredTheme] = useLocalStorage<'light' | 'dark'>(STORAGE_KEY, 'dark');

    const [isDark, setIsDark] = useState<boolean>(() => {
        if (isWeb) {
            return (storedTheme ?? 'dark') === 'dark';
        }
        return systemTheme === 'dark';
    });

    const [isManualOverride, setIsManualOverride] = useState<boolean>(isWeb);

    useEffect(() => {
        if (isWeb && storedTheme) {
            setIsDark(storedTheme === 'dark');
        }
    }, [isWeb, storedTheme]);

    useEffect(() => {
        if (!isManualOverride) {
            setIsDark(systemTheme === 'dark');
        }
    }, [systemTheme, isManualOverride]);

    const toggleTheme = () => {
        setIsDark((prev) => {
            const next = !prev;
            if (isWeb) {
                setStoredTheme(next ? 'dark' : 'light');
            }
            return next;
        });
        setIsManualOverride(true);
    };

    const currentTheme = isDark ? 'dark' : 'light';

    useEffect(() => {
        if (isWeb && typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', currentTheme);
        }
    }, [currentTheme]);

    return (
        <ThemeContext.Provider value={{isDark, toggleTheme, currentTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        return {
            isDark: false,
            toggleTheme: () => {
            },
            currentTheme: 'light' as 'light' | 'dark'
        };
    }
    return context;
};

export interface ThemeSwitchProps {
    size?: number;
    color?: string;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
                                                            size = 22,
                                                            color
                                                        }) => {
    const {isDark, toggleTheme} = useThemeContext();

    const iconColor = color || (isDark ? '#FDB813' : '#1a1a1a');

    return (
        <TouchableOpacity
            onPress={toggleTheme}
            accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
                padding: 4,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
            }}
        >
            {isDark ? (
                <SunFilledIcon size={size} color={iconColor}/>
            ) : (
                <MoonFilledIcon size={size} color={iconColor}/>
            )}
        </TouchableOpacity>
    );
};
