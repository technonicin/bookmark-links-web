'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User, Lock, ArrowLeft, Bookmark, AtSign } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

type Mode = 'login' | 'signup' | 'forgot';

// Converts a username to a deterministic internal email
// This is never shown to the user — it's just how Supabase auth works internally.
function toInternalEmail(username: string) {
    return `${username.toLowerCase().trim()}@bookmarklinks.local`;
}

export default function AuthForm() {
    const [mode, setMode] = useState<Mode>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const resetMessages = () => { setError(null); setSuccess(null); };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        resetMessages();

        const trimmed = username.toLowerCase().trim();

        // Basic validation
        if (!trimmed) { setError('Please enter a username.'); setLoading(false); return; }
        if (!/^[a-z0-9_]+$/.test(trimmed)) {
            setError('Username can only contain letters, numbers, and underscores.');
            setLoading(false); return;
        }

        const email = toInternalEmail(trimmed);

        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else if (mode === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        // Store the username in user_metadata so our trigger / profile can use it
                        data: { username: trimmed },
                        // Skip email confirmation
                        emailRedirectTo: undefined,
                    }
                });
                if (error) throw error;

                // Upsert profile with the chosen username
                if (data.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .upsert({ id: data.user.id, username: trimmed }, { onConflict: 'id' });
                    if (profileError) throw profileError;
                }

                setSuccess('Account created! You can now sign in.');
                setUsername(''); setPassword('');
            }
        } catch (err: any) {
            // Surface friendly messages
            const msg = err.message || '';
            if (msg.includes('already registered') || msg.includes('already been registered')) {
                setError('That username is already taken. Please choose another.');
            } else if (msg.includes('Invalid login credentials')) {
                setError('Incorrect username or password.');
            } else {
                setError(msg || 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (next: Mode) => {
        setMode(next);
        resetMessages();
        setPassword('');
    };

    return (
        <div className="auth-wrapper">
            <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 50 }}>
                <ThemeToggle />
            </div>

            <div className="glass auth-card animate-fade-in">
                {/* Logo */}
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <Bookmark size={22} color="white" fill="white" />
                    </div>
                    <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                        BookmarkLinks
                    </span>
                </div>

                <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.375rem', marginBottom: '1.75rem' }}>
                    {mode === 'login' ? 'Welcome back — enter your username to continue' : 'Choose a username to get started'}
                </p>

                {/* Tabs */}
                <div className="auth-tabs">
                    <button type="button" className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => switchMode('login')}>
                        Sign In
                    </button>
                    <button type="button" className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => switchMode('signup')}>
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Username */}
                    <div className="input-wrapper">
                        <AtSign size={16} className="input-icon" />
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                            spellCheck={false}
                            autoCapitalize="none"
                        />
                    </div>

                    {/* Password */}
                    <div className="input-wrapper">
                        <Lock size={16} className="input-icon" />
                        <input
                            className="input-field"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            minLength={mode === 'signup' ? 6 : undefined}
                        />
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <button className="btn btn-primary" type="submit" disabled={loading} style={{ padding: '0.75rem' }}>
                        {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                {mode === 'signup' && (
                    <p className="text-subtle" style={{ fontSize: '0.75rem', marginTop: '1rem', lineHeight: '1.5' }}>
                        Usernames can only contain letters, numbers, and underscores. Min 6 characters for password.
                    </p>
                )}
            </div>
        </div>
    );
}
