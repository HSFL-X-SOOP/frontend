// src/context/AuthContext.tsx
import React, {createContext, useContext, useState, ReactNode} from 'react';

import {useLocalStorage} from '@/hooks/useLocalStorage.ts';
export interface SessionInfo {
    userId: number;
}

interface AuthContextType {
    session?: SessionInfo;
    login: (session: SessionInfo) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    session: undefined,
    login: () => {
    },
    logout: () => {
    },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [stored, setStored] = useLocalStorage<SessionInfo>('session');
    const [session, setSession] = useState<SessionInfo | undefined>(stored);

    const login = (newSession: SessionInfo) => {
        setSession(newSession);
        setStored(newSession);
    };
    const logout = () => {
        setSession(undefined);
        setStored(undefined);
    };

    return (
        <AuthContext.Provider value={{session, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
