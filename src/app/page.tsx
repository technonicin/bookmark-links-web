'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import ThemeToggle from '@/components/ThemeToggle';
import PublicProfile from './PublicProfile';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

/* ── tiny icon components (inline SVG so no extra dep) ─────────────── */
function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

/* ── data ───────────────────────────────────────────────────────────── */
const STEPS = [
  {
    num: '01',
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    title: 'Install the Extension',
    desc: 'Add BookmarkLinks to Chrome in one click from the Web Store.',
  },
  {
    num: '02',
    icon: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z',
    title: 'Save tabs instantly',
    desc: 'Click the extension icon to save the current tab — or double-click to save every open tab at once.',
  },
  {
    num: '03',
    icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    title: 'Access Anywhere',
    desc: 'Open your dashboard from any device to browse, filter, and revisit saved links.',
  },
];

const FEATURES = [
  {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: '#f59e0b',
    title: 'One-click Save',
    desc: 'Save the active tab to your account instantly with a single click on the extension icon.',
  },
  {
    icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
    color: '#6366f1',
    title: 'Save All Tabs',
    desc: 'Double-click the icon (Quick Save mode) to bulk-save every tab in the current window.',
  },
  {
    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A2 2 0 0 1 3 12V7a4 4 0 0 1 4-4z',
    color: '#10b981',
    title: 'Smart Categories',
    desc: 'Tag your saves with categories like Work, Design, or DevStuff. Create custom tags on the fly.',
  },
  {
    icon: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z',
    color: '#8b5cf6',
    title: 'Instant Search',
    desc: 'Full-text search across all your bookmarks by title, URL, or description in milliseconds.',
  },
  {
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    color: '#ec4899',
    title: 'Secure Sync',
    desc: 'Your bookmarks are synced to Supabase in real-time — private by default, accessible from anywhere.',
  },
  {
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    color: '#f97316',
    title: 'Public Profiles',
    desc: 'Share a public link like bookmarklinks.app/?u=yourname so others can browse your curated links.',
  },
  {
    icon: 'M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M20.66 17.5l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3',
    color: '#06b6d4',
    title: 'Quick Save Mode',
    desc: 'Toggle Quick Save in the options page to skip the popup entirely and save with a single icon click.',
  },
  {
    icon: 'M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z',
    color: '#ef4444',
    title: 'Favorites',
    desc: 'Star any bookmark to pin it to your favourites filter for lightning-fast access.',
  },
];

/* ── main page content ──────────────────────────────────────────────── */
function HomeContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetUser = searchParams.get('u');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && user && !loading && !targetUser) router.push('/dashboard');
  }, [mounted, user, loading, targetUser, router]);

  if (targetUser) return <PublicProfile searchParams={{ u: targetUser }} />;
  if (!mounted || loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="landing">
      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <nav className="land-nav">
        <div className="land-nav-inner">
          <div className="land-brand">
            <div className="land-brand-icon">
              <Icon d="M5 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5zM3 13h18M3 17h18" size={16} />
            </div>
            <span>BookmarkLinks</span>
          </div>
          <div className="land-nav-right">
            <ThemeToggle />
            <Link href="/" className="btn btn-outline land-nav-btn">Sign In</Link>
            <Link href="/?signup=1" className="btn btn-primary land-nav-btn">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="land-hero">
        <div className="land-hero-glow land-hero-glow-1" />
        <div className="land-hero-glow land-hero-glow-2" />
        <div className="land-container">
          <div className="land-badge">
            <span className="land-badge-dot" />
            Chrome Extension · Free Forever
          </div>
          <h1 className="land-hero-title">
            Save any tab.<br />
            <span className="land-gradient-text">Never lose a link again.</span>
          </h1>
          <p className="land-hero-sub">
            BookmarkLinks is a Chrome extension + web dashboard that lets you save, tag, and access every link — from any device, instantly.
          </p>
          <div className="land-hero-cta">
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
              className="btn land-cta-primary"
            >
              <Icon d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" size={16} />
              Add to Chrome — Free
            </a>
            <Link href="/" className="btn land-cta-outline">
              Open Dashboard
            </Link>
          </div>
          <p className="land-hero-note">No credit card · No email confirmation required</p>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="land-section">
        <div className="land-container">
          <div className="land-section-label">HOW IT WORKS</div>
          <h2 className="land-section-title">Three steps. Any device.</h2>
          <p className="land-section-sub">Set up in under a minute and start saving immediately.</p>

          <div className="land-steps">
            {STEPS.map((s) => (
              <div key={s.num} className="land-step-card">
                <div className="land-step-num">{s.num}</div>
                <div className="land-step-icon-wrap">
                  <Icon d={s.icon} size={22} />
                </div>
                <h3 className="land-step-title">{s.title}</h3>
                <p className="land-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ──────────────────────────────────────────── */}
      <section className="land-section land-section-alt">
        <div className="land-container">
          <div className="land-section-label">FEATURES</div>
          <h2 className="land-section-title">Your bookmarks, everywhere.</h2>
          <p className="land-section-sub">Everything you need to manage your links — built into one lightweight extension.</p>

          <div className="land-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="land-feature-card">
                <div className="land-feature-icon" style={{ '--feature-color': f.color } as React.CSSProperties}>
                  <Icon d={f.icon} size={20} />
                </div>
                <h3 className="land-feature-title">{f.title}</h3>
                <p className="land-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHARE CTA ──────────────────────────────────────────────── */}
      <section className="land-section">
        <div className="land-container">
          <div className="land-share-wrap">
            <div className="land-share-text">
              <div className="land-section-label">SHARE &amp; DISCOVER</div>
              <h2 className="land-section-title" style={{ marginBottom: '1rem' }}>
                Share your links<br />with anyone.
              </h2>
              <p className="land-share-desc">
                Every account gets a public profile page. Share a URL like{' '}
                <code className="land-code">bookmarklinks.app/?u=yourname</code>{' '}
                and let people browse your curated collection — no login required for visitors.
              </p>
              <ul className="land-share-list">
                {[
                  'Public profile, no sign-in needed for viewers',
                  'Automatic favicon previews for every link',
                  'Category filters so visitors find what they need',
                  'Fully linkable — share it in your bio or portfolio',
                ].map((item) => (
                  <li key={item}>
                    <span className="land-check">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link href="/" className="btn land-cta-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                Create Your Profile
              </Link>
            </div>
            <div className="land-share-visual">
              <div className="land-profile-preview">
                <div className="lpp-header">
                  <div className="lpp-avatar">P</div>
                  <div>
                    <div className="lpp-name">@pratik</div>
                    <div className="lpp-count">34 links saved</div>
                  </div>
                </div>
                {[
                  { icon: '📚', cat: 'Learn', title: 'Next.js 15 Docs', url: 'nextjs.org' },
                  { icon: '👨‍💻', cat: 'DevStuff', title: 'Supabase Dashboard', url: 'supabase.com' },
                  { icon: '🎨', cat: 'Design', title: 'Shadcn UI Components', url: 'ui.shadcn.com' },
                  { icon: '📖', cat: 'Read', title: 'The Pragmatic Programmer', url: 'amazon.com' },
                ].map((item) => (
                  <div key={item.title} className="lpp-item">
                    <span className="lpp-cat-icon">{item.icon}</span>
                    <div className="lpp-item-info">
                      <div className="lpp-item-title">{item.title}</div>
                      <div className="lpp-item-url">{item.url}</div>
                    </div>
                    <span className="lpp-cat-badge">{item.cat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────────────────── */}
      <section className="land-bottom-cta">
        <div className="land-container" style={{ textAlign: 'center' }}>
          <h2 className="land-bottom-title">Your links, on every device.</h2>
          <p className="land-bottom-sub">
            Install the extension, create a free account, and start saving in seconds.
          </p>
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className="btn land-cta-primary land-cta-lg"
          >
            <Icon d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" size={18} />
            Add to Chrome — It&apos;s Free
          </a>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="land-footer">
        <div className="land-footer-inner">
          <div className="land-brand land-footer-brand">
            <div className="land-brand-icon">
              <Icon d="M5 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5zM3 13h18M3 17h18" size={14} />
            </div>
            <span>BookmarkLinks</span>
          </div>
          <div className="land-footer-links">
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
          <div className="land-footer-links">
            <a href="https://github.com/technonicin/bookmark-links-web" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer">Chrome Store</a>
          </div>
        </div>
        <div className="land-footer-copy">© 2026 BookmarkLinks. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
