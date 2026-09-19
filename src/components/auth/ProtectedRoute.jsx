import React, { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                await getCurrentUser();

                setAuthenticated(true);
            } catch (error) {
                setAuthenticated(false);
            } finally {
                setChecking(false);
            }
        };

        checkAuthentication();
    }, []);

    if (checking) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin" />

                    <p className="text-sm text-stone-600">
                        Verifying conservation access...
                    </p>
                </div>
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/dashboard/login" replace />;
    }

    return children;
}