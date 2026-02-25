'use client';

import { Bookmark as BookmarkIcon, Heart, Tag, Trash2 } from 'lucide-react';

export type Bookmark = {
    id: string;
    url: string;
    title: string;
    description: string;
    favicon_url: string;
    category: string;
    is_favorite: boolean;
    created_at: string;
};

interface BookmarkCardProps {
    bookmark: Bookmark;
    onToggleFavorite?: (id: string, current: boolean) => void;
    onDelete?: (id: string) => void;
    isOwner: boolean;
}

export default function BookmarkCard({ bookmark, onToggleFavorite, onDelete, isOwner }: BookmarkCardProps) {
    const date = new Date(bookmark.created_at);
    const dateStr = date.toLocaleDateString('en-US', {
        day: 'numeric', month: 'short',
    });
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', hour12: true
    });
    const displayDateTime = `${dateStr}, ${weekday}, ${timeStr}`;

    const displayUrl = (() => {
        try {
            return new URL(bookmark.url).hostname.replace(/^www\./, '');
        } catch {
            return bookmark.url;
        }
    })();

    return (
        <div className="bookmark-card">
            {/* Top row: favicon + title + actions */}
            <div className="bookmark-card-top">
                {bookmark.favicon_url ? (
                    <img
                        src={bookmark.favicon_url}
                        alt=""
                        className="bookmark-favicon"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                ) : (
                    <div className="bookmark-favicon-placeholder">
                        <BookmarkIcon size={16} />
                    </div>
                )}

                <div className="bookmark-title-group">
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bookmark-title"
                        title={bookmark.title || bookmark.url}
                    >
                        {bookmark.title || displayUrl}
                    </a>
                    <div className="bookmark-url">{displayUrl}</div>
                </div>

                {isOwner && (
                    <div className="bookmark-card-actions">
                        <button
                            className={`bookmark-action-btn${bookmark.is_favorite ? ' fav-active' : ''}`}
                            onClick={() => onToggleFavorite && onToggleFavorite(bookmark.id, bookmark.is_favorite)}
                            title="Toggle Favorite"
                        >
                            <Heart size={15} fill={bookmark.is_favorite ? '#ef4444' : 'none'} />
                        </button>
                        <button
                            className="bookmark-action-btn"
                            onClick={() => onDelete && onDelete(bookmark.id)}
                            title="Delete"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                )}
            </div>

            {/* Footer: category pill + datetime */}
            <div className="bookmark-card-footer">
                {bookmark.category ? (
                    <span className="bookmark-category-pill">
                        <Tag size={10} />
                        {bookmark.category}
                    </span>
                ) : (
                    <span />
                )}
                <span className="bookmark-datetime">{displayDateTime}</span>
            </div>
        </div>
    );
}
