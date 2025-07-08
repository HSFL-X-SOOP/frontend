// src/hooks/useLocalStorage.ts
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export function useLocalStorage<T>(key: string, initialValue?: T): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
    const stored = localStorage.getItem(key);
    const [value, setValue] = useState<T | undefined>(stored ? JSON.parse(stored) : initialValue);

    useEffect(() => {
        if (value !== undefined) localStorage.setItem(key, JSON.stringify(value));
        else localStorage.removeItem(key);
    }, [key, value]);

    return [value, setValue];
}