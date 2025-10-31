import React, {createContext, ReactNode, useContext} from 'react';

import {useLocalStorage} from '@/hooks/useLocalStorage';
import {useRouter} from 'expo-router';
import {UserProfile} from '@/api/models/profile';

export interface SessionInfo {
    accessToken: string;
    refreshToken: string | null;
    loggedInSince: Date;
    lastTokenRefresh: Date | null;
    profile: UserProfile | null;
}

interface AuthContextType {
    session?: SessionInfo;
    login: (session: SessionInfo) => void;
    logout: () => void;
    updateProfile: (profile: UserProfile | undefined) => void;
}

const SessionContext = createContext<AuthContextType>({
    session: undefined,
    login: () => {
    },
    logout: () => {
    },
    updateProfile: () => {
    },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [stored, setStored] = useLocalStorage<SessionInfo>('session');
    const router = useRouter();

    const login = (newSession: SessionInfo) => {
        setStored(newSession);
    };

    const logout = () => {
        setStored(undefined);
        router.push('/');
    };

    const updateProfile = (profile: UserProfile | undefined) => {
        if (stored) {
            setStored({...stored, profile: profile || null});
        }
    };

    return (
        <SessionContext.Provider value={{session: stored, login, logout, updateProfile}}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
