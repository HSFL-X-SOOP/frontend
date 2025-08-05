// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../context/SessionContext.tsx';

export const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { session } = useSession();
    const location = useLocation();

    if (!session) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    return children;
};
