import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import { createLogger } from '@/utils/logger';

const logger = createLogger('Hooks:LocalStorage');

export function useLocalStorage<T>(key: string, initialValue?: T): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
    const [value, setValue] = useState<T | undefined>(initialValue);

    useEffect(() => {
        const loadStoredValue = async () => {
            try {
                let storedValue: string | null;

                if (Platform.OS === 'web') {
                    storedValue = localStorage.getItem(key);
                } else {
                    storedValue = await Storage.getItem(key);
                }

                if (storedValue !== null) {
                    setValue(JSON.parse(storedValue));
                }
            } catch (error) {
                logger.error(`Error loading key "${key}" from storage`, error);
            }
        };

        loadStoredValue();
    }, [key]);

    useEffect(() => {
        const saveToStorage = async () => {
            try {
                if (value === undefined) {
                    await Storage.removeItem(key);
                } else {
                    await Storage.setItem(key, JSON.stringify(value));
                }
            } catch (error) {
                logger.error(`Error saving key "${key}" to storage`, error);
            }
        };

        saveToStorage();
    }, [key, value]);

    return [value, setValue];
}

const Storage = {
    setItem: async (key: string, value: string) => {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, value);
        } else {
            await AsyncStorage.setItem(key, value);
        }
    },

    getItem: async (key: string) => {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key);
        } else {
            return await AsyncStorage.getItem(key);
        }
    },

    removeItem: async (key: string) => {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
        } else {
            await AsyncStorage.removeItem(key);
        }
    }
};