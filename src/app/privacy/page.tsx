import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy – BookmarkLinks',
    description: 'Privacy Policy for BookmarkLinks web app and Chrome extension.',
};

export default function PrivacyPage() {
    const lastUpdated = 'February 25, 2026';
    const contactEmail = 'support@bookmarklinks.app';

    return (
        <div className="privacy-page">
            {/* Nav */}
            <nav className="land-nav">
                <div className="land-nav-inner">
                    <Link href="/" className="land-brand" style={{ textDecoration: 'none' }}>
                        <div className="land-brand-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5zM3 13h18M3 17h18" />
                            </svg>
                        </div>
                        <span>BookmarkLinks</span>
                    </Link>
                    <Link href="/" className="btn btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.8125rem' }}>
                        ← Back to Home
                    </Link>
                </div>
            </nav>

            <div className="privacy-container">
                <div className="privacy-header">
                    <h1>Privacy Policy</h1>
                    <p className="privacy-meta">Last updated: {lastUpdated}</p>
                    <p className="privacy-intro">
                        This Privacy Policy describes how <strong>BookmarkLinks</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects,
                        uses, and protects information when you use our web application at{' '}
                        <strong>bookmark-links-web-1fsc.vercel.app</strong> and our{' '}
                        <strong>BookmarkLinks Chrome Extension</strong>.
                    </p>
                </div>

                <div className="privacy-content">

                    <section className="privacy-section">
                        <h2>1. Information We Collect</h2>

                        <h3>1.1 Information You Provide</h3>
                        <ul>
                            <li><strong>Username &amp; Password</strong> — used to create and access your account. We do not collect your email address.</li>
                            <li><strong>Saved Bookmarks</strong> — URLs, page titles, descriptions, favicons, and categories you choose to save.</li>
                        </ul>

                        <h3>1.2 Information Collected Automatically</h3>
                        <ul>
                            <li><strong>Browser Tabs (Extension only)</strong> — the URL and title of the tab(s) you explicitly choose to save. We do <em>not</em> monitor your browsing history passively or collect any tab data without a direct action from you.</li>
                            <li><strong>Authentication Tokens</strong> — session tokens stored locally in your browser to keep you signed in.</li>
                            <li><strong>Favicons</strong> — page icons fetched to display alongside your saved bookmarks.</li>
                        </ul>

                        <h3>1.3 Information We Do NOT Collect</h3>
                        <ul>
                            <li>Email addresses</li>
                            <li>Phone numbers or physical addresses</li>
                            <li>Payment information</li>
                            <li>Passively monitored browsing history</li>
                            <li>Location data</li>
                            <li>Device identifiers or fingerprinting data</li>
                        </ul>
                    </section>

                    <section className="privacy-section">
                        <h2>2. Chrome Extension — Permissions Explained</h2>
                        <p>The BookmarkLinks Chrome Extension requests the following permissions. Each permission is used solely for the stated purpose:</p>

                        <div className="privacy-table-wrap">
                            <table className="privacy-table">
                                <thead>
                                    <tr>
                                        <th>Permission</th>
                                        <th>Why it&apos;s needed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><code>activeTab</code></td>
                                        <td>Read the URL and title of the tab you are currently viewing so it can be saved on your request.</td>
                                    </tr>
                                    <tr>
                                        <td><code>tabs</code></td>
                                        <td>Access all open tab URLs/titles when you use the &quot;Save All Tabs&quot; feature.</td>
                                    </tr>
                                    <tr>
                                        <td><code>scripting</code></td>
                                        <td>Inject a small content script to read page metadata (title, description, favicon) for richer bookmark previews.</td>
                                    </tr>
                                    <tr>
                                        <td><code>storage</code></td>
                                        <td>Store your session token and Quick Save preference locally on your device.</td>
                                    </tr>
                                    <tr>
                                        <td><code>notifications</code></td>
                                        <td>Show a brief desktop notification confirming a bookmark was saved.</td>
                                    </tr>
                                    <tr>
                                        <td><code>&lt;all_urls&gt;</code> (host permission)</td>
                                        <td>Required to inject the metadata content script on any page you choose to save. No data is collected from pages you don&apos;t explicitly save.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <p>
                            <strong>We do not sell, share, or transmit any tab data to third parties.</strong> Tab data is only sent to our secure database when you explicitly click &quot;Save&quot; or use Quick Save.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>3. How We Use Your Information</h2>
                        <ul>
                            <li>To provide, operate, and maintain the BookmarkLinks service</li>
                            <li>To authenticate you and sync your bookmarks across devices</li>
                            <li>To display your public profile page (only if you choose to share it)</li>
                            <li>To improve the reliability and performance of the service</li>
                        </ul>
                        <p>We do <strong>not</strong> use your data for advertising, profiling, or any purpose beyond operating the service.</p>
                    </section>

                    <section className="privacy-section">
                        <h2>4. Data Storage &amp; Security</h2>
                        <p>
                            Your data is stored securely in a cloud database. All data is transmitted over
                            encrypted HTTPS connections. We apply industry-standard access controls and
                            row-level security policies so that only you can read or modify your bookmarks.
                        </p>
                        <p>
                            Session tokens are stored in your browser&apos;s local storage and are never
                            transmitted to any third party beyond our authentication service.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>5. Data Sharing</h2>
                        <p>We do <strong>not</strong> sell, rent, or share your personal information with third parties, except:</p>
                        <ul>
                            <li><strong>Service providers</strong> — We use third-party cloud infrastructure to store data securely. These providers are contractually bound to protect your data.</li>
                            <li><strong>Legal requirements</strong> — We may disclose information if required by law or to protect the rights and safety of our users.</li>
                        </ul>
                    </section>

                    <section className="privacy-section">
                        <h2>6. Public Profiles</h2>
                        <p>
                            If you share your public profile link (<code>/?u=yourusername</code>), any
                            bookmarks you have saved will be visible to anyone with the link. You control
                            this entirely — your profile is only accessible if you actively share the link.
                            No bookmarks are publicly indexed by default.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>7. Data Retention &amp; Deletion</h2>
                        <p>
                            Your data is retained for as long as your account is active. You may delete
                            individual bookmarks at any time from the dashboard. To request full account
                            deletion, contact us at{' '}
                            <a href={`mailto:${contactEmail}`} className="privacy-link">{contactEmail}</a>.
                            We will permanently delete all your data within 30 days of your request.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>8. Children&apos;s Privacy</h2>
                        <p>
                            BookmarkLinks is not directed to children under 13 years of age. We do not
                            knowingly collect personal information from children under 13. If you believe
                            a child has provided us with personal information, please contact us and we
                            will delete it promptly.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>9. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will indicate the
                            &quot;Last updated&quot; date at the top of this page. Continued use of the service
                            after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>10. Contact Us</h2>
                        <p>
                            If you have any questions or concerns about this Privacy Policy or your data,
                            please contact us at:{' '}
                            <a href={`mailto:${contactEmail}`} className="privacy-link">{contactEmail}</a>
                        </p>
                    </section>

                </div>

                <div className="privacy-footer-note">
                    <Link href="/" className="btn btn-outline">← Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
