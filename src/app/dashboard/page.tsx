'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import BookmarkCard, { Bookmark } from '@/components/BookmarkCard';
import ThemeToggle from '@/components/ThemeToggle';
import {
    LogOut, Search, BookMarked,
    ExternalLink, ChevronDown, CalendarDays, X, Star
} from 'lucide-react';

// ── helpers ──────────────────────────────────────────
function getLocalDateKey(isoString: string) {
    return new Date(isoString).toLocaleDateString('en-CA'); // YYYY-MM-DD in local tz
}

function formatSectionDate(isoString: string) {
    return new Date(isoString).toLocaleDateString('en-US', {
        day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase(); // "24 FEB 2026"
}

export default function Dashboard() {
    const { user, username, loading } = useAuth();
    const router = useRouter();

    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [collapsedDates, setCollapsedDates] = useState<Set<string>>(new Set());

    // Filters — kept identical to original
    const [search, setSearch] = useState('');
    const [filterMode, setFilterMode] = useState<'All' | 'Favorites' | 'This Week' | 'This Month'>('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState(''); // YYYY-MM-DD

    useEffect(() => {
        if (!loading && !user) router.push('/');
    }, [user, loading, router]);

    useEffect(() => {
        if (user) fetchBookmarks();
    }, [user]);

    const fetchBookmarks = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('bookmarks')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

        if (!error && data) setBookmarks(data as Bookmark[]);
        setIsLoading(false);
    };

    const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
        setBookmarks(prev => prev.map(b => b.id === id ? { ...b, is_favorite: !currentStatus } : b));
        await supabase.from('bookmarks').update({ is_favorite: !currentStatus }).eq('id', id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this bookmark?')) return;
        setBookmarks(prev => prev.filter(b => b.id !== id));
        await supabase.from('bookmarks').delete().eq('id', id);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const toggleDateSection = (key: string) => {
        setCollapsedDates(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    if (loading || !user) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%', margin: '0 auto 1rem' }} />
                    Loading dashboard...
                </div>
            </div>
        );
    }

    // ── Derived state ─────────────────────────────────
    const categories = ['All', ...Array.from(new Set(bookmarks.map(b => b.category).filter(Boolean)))];

    const filtered = bookmarks.filter(b => {
        if (search && !b.title?.toLowerCase().includes(search.toLowerCase()) && !b.description?.toLowerCase().includes(search.toLowerCase())) return false;
        if (categoryFilter !== 'All' && b.category !== categoryFilter) return false;
        if (filterMode === 'Favorites' && !b.is_favorite) return false;

        const date = new Date(b.created_at);
        const now = new Date();
        if (filterMode === 'This Week' && date < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) return false;
        if (filterMode === 'This Month' && date < new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())) return false;

        if (dateFilter) {
            if (getLocalDateKey(b.created_at) !== dateFilter) return false;
        }

        return true;
    });

    // Group by date (YYYY-MM-DD key)
    const groupMap = new Map<string, Bookmark[]>();
    for (const b of filtered) {
        const key = getLocalDateKey(b.created_at);
        if (!groupMap.has(key)) groupMap.set(key, []);
        groupMap.get(key)!.push(b);
    }
    const groups = Array.from(groupMap.entries()); // already sorted by created_at desc

    const activeFilterCount = [
        search ? 1 : 0,
        filterMode !== 'All' ? 1 : 0,
        categoryFilter !== 'All' ? 1 : 0,
        dateFilter ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    const clearFilters = () => {
        setSearch('');
        setFilterMode('All');
        setCategoryFilter('All');
        setDateFilter('');
    };

    const favCount = bookmarks.filter(b => b.is_favorite).length;

    return (
        <>
            {/* ── Navbar ── */}
            <nav className="navbar">
                <div className="navbar-inner">
                    {/* Brand */}
                    <div className="navbar-brand">
                        <div className="navbar-brand-icon" style={{ overflow: 'hidden', padding: 0, background: 'none', border: 'none' }}>
                            <img src="/icon.svg" alt="BookmarkLinks" style={{ width: 30, height: 30, borderRadius: 8, display: 'block' }} />
                        </div>
                        <span className="text-gradient">BookmarkLinks</span>
                    </div>

                    {/* Centre: user stat pill */}
                    {username && (
                        <div className="nav-stat">
                            <strong>@{username}</strong>
                            <span className="nav-dot">·</span>
                            {bookmarks.length} link{bookmarks.length !== 1 ? 's' : ''}
                            <span className="nav-dot">·</span>
                            <a
                                href={`/?u=${username}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                title="View public profile"
                            >
                                <ExternalLink size={12} />
                                Public
                            </a>
                        </div>
                    )}

                    {/* Right: logout + theme */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                            onClick={handleLogout}
                            className="btn btn-outline"
                            style={{ fontSize: '0.8rem', gap: '0.35rem', padding: '0.4rem 0.875rem' }}
                        >
                            <LogOut size={13} /> Logout
                        </button>
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {/* ── Main Content ── */}
            <div className="container">

                {/* ── Filter Bar ── */}
                <div className="filter-bar animate-fade-in">
                    {/* Search */}
                    <div className="filter-search">
                        <Search size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search links..."
                        />
                    </div>

                    <div className="filter-bar-divider" />

                    {/* Mode chips */}
                    {(['All', 'Favorites', 'This Week', 'This Month'] as const).map(mode => (
                        <button
                            key={mode}
                            onClick={() => setFilterMode(mode)}
                            className={`filter-chip${filterMode === mode ? ' active' : ''}`}
                        >
                            {mode === 'Favorites' && <Star size={11} />}
                            {mode}
                            {mode === 'All' && <span style={{ opacity: 0.6, fontWeight: 400 }}>{bookmarks.length}</span>}
                            {mode === 'Favorites' && <span style={{ opacity: 0.6, fontWeight: 400 }}>{favCount}</span>}
                        </button>
                    ))}

                    <div className="filter-bar-divider" />

                    {/* Date picker */}
                    <div className={`filter-date${dateFilter ? ' has-value' : ''}`}>
                        <CalendarDays size={13} color={dateFilter ? 'var(--primary)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                            style={{ colorScheme: 'dark' }}
                        />
                        {dateFilter && (
                            <button className="filter-clear-btn" onClick={() => setDateFilter('')}>
                                <X size={12} />
                            </button>
                        )}
                    </div>

                    {/* Category dropdown */}
                    {categories.length > 1 && (
                        <select
                            className="filter-select"
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    )}

                    {/* Clear all */}
                    {activeFilterCount > 0 && (
                        <button onClick={clearFilters} className="filter-chip" style={{ color: 'var(--danger)', borderColor: 'transparent' }}>
                            <X size={11} /> Clear {activeFilterCount > 1 ? `(${activeFilterCount})` : ''}
                        </button>
                    )}
                </div>

                {/* Results summary */}
                {!isLoading && activeFilterCount > 0 && (
                    <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '-0.75rem', marginBottom: '1.25rem' }}>
                        Showing {filtered.length} of {bookmarks.length} links
                    </p>
                )}

                {/* ── Content ── */}
                {isLoading ? (
                    <div className="bookmark-grid">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 'var(--radius)' }} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--text-muted)' }}>
                        <BookMarked size={44} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                        <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No bookmarks found</p>
                        <p style={{ fontSize: '0.875rem' }}>
                            {bookmarks.length === 0 ? 'Use the Chrome Extension to save your tabs!' : 'Try adjusting your filters.'}
                        </p>
                        {activeFilterCount > 0 && (
                            <button onClick={clearFilters} className="btn btn-outline" style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    groups.map(([dateKey, items]) => (
                        <div key={dateKey} className="date-section animate-fade-in">
                            {/* Section header */}
                            <div
                                className="date-section-header"
                                onClick={() => toggleDateSection(dateKey)}
                            >
                                <ChevronDown
                                    size={16}
                                    className={`date-section-chevron${collapsedDates.has(dateKey) ? ' collapsed' : ''}`}
                                />
                                <span className="date-section-label">
                                    {formatSectionDate(items[0].created_at)}
                                </span>
                                <span className="date-section-count">
                                    {items.length} {items.length === 1 ? 'link' : 'links'}
                                </span>
                                <div className="date-section-line" />
                            </div>

                            {/* Cards grid */}
                            {!collapsedDates.has(dateKey) && (
                                <div className="bookmark-grid">
                                    {items.map(bookmark => (
                                        <BookmarkCard
                                            key={bookmark.id}
                                            bookmark={bookmark}
                                            isOwner={true}
                                            onToggleFavorite={handleToggleFavorite}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
