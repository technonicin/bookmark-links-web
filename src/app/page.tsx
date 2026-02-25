'use client';

import { useAuth } from '@/components/AuthProvider';
import AuthForm from '@/components/AuthForm';
import PublicProfile from './PublicProfile';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function HomeContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetUser = searchParams.get('u');

  // We only run client-side redirection after mounted to avoid hydration errors
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user && !loading && !targetUser) {
      router.push('/dashboard');
    }
  }, [mounted, user, loading, targetUser, router]);

  // If a user profile is requested, render the public mode
  if (targetUser) {
    return <PublicProfile searchParams={{ u: targetUser }} />;
  }

  if (!mounted || loading) {
    return <div className="auth-wrapper glass" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (user) {
    return null; // Will redirect via useEffect
  }

  return <AuthForm />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="auth-wrapper glass" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
