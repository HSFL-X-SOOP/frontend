// src/context/SessionContext.tsx
import React, {createContext, useContext, useState, ReactNode} from 'react';

import {useLocalStorage} from '@/hooks/useLocalStorage.ts';
import {useNavigate} from "react-router-dom";

export interface SessionInfo {
    accessToken: string;
    refreshToken: string | null;
    loggedInSince: Date;
    lastTokenRefresh: Date | null;
}

interface AuthContextType {
    session?: SessionInfo;
    login: (session: SessionInfo) => void;
    logout: () => void;
}

const SessionContext = createContext<AuthContextType>({
    session: undefined,
    login: () => {
    },
    logout: () => {
    },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [stored, setStored] = useLocalStorage<SessionInfo>('session');
    const [session, setSession] = useState<SessionInfo | undefined>(stored);
    const navigation = useNavigate();

    const login = (newSession: SessionInfo) => {
        setSession(newSession);
        setStored(newSession);
    };
    const logout = () => {
        setSession(undefined);
        setStored(undefined);
        navigation('/');
    };

    return (
        <SessionContext.Provider value={{session, login, logout}}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
