'use client';

import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // If already signed in, redirect to dashboard
    useEffect(() => {
        if (!loading && user) router.replace('/dashboard');
    }, [user, loading, router]);

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner" />
        </div>
    );

    return <AuthForm />;
}
