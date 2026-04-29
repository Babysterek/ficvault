import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Home({ user }: any) {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            // 1. Fetch stories and their chapters count
            let query = supabase
                .from('stories')
                .select(`
                    *,
                    chapters (id)
                `);

            // 🕵️ Hide drafts from regular users
            if (!user?.isAdmin) {
                query = query.eq('status', 'published');
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (!error && data) {
                setStories(data);
            }
            setLoading(false);
        };
        fetchStories();
    }, [user]);

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px', textAlign: 'left', minHeight: '100vh' }}>
            <header style={{ borderBottom: '3px solid #3E2723', marginBottom: '30px', paddingBottom: '20px' }}>
                <h1 style={{ color: '#3E2723', fontFamily: 'serif', fontSize: '2.8rem', margin: 0 }}>FICVAULT ARCHIVE</h1>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>Secure collection accessed by: <strong>{user?.pseudo || 'Authorized User'}</strong></p>

                {/* 🧭 NAVIGATION BAR WITH ALL POSTING OPTIONS */}
                <nav style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
                    {user?.isAdmin && (
                        <>
                            <Link to="/post-work" style={navStyle}>+ Manual Post</Link>
                            <Link to="/post-word" style={navStyle}>📥 Word Import</Link>
                            <Link to="/post-epub" style={navStyle}>📔 EPUB Import</Link>
                            <Link to="/manage-stories" style={navStyle}>⚙️ Manage Vault</Link>
                        </>
                    )}
                    <Link to="/my-stories" style={navStyle}>🔖 My Bookmarks</Link>
                </nav>
            </header>

            <div className="vault-list">
                {loading ? (
                    <p style={{ fontStyle: 'italic' }}>Scanning vault sectors...</p>
                ) : stories.length > 0 ? (
                    stories.map((story) => {
                        const chapterCount = story.chapters?.length || 0;
                        const expected = story.expected_chapters || '?';

                        return (
                            <div key={story.id} style={{
                                background: 'white',
                                padding: '25px',
                                border: '1px solid #3E2723',
                                boxShadow: '6px 6px 0px #3E2723',
                                marginBottom: '30px',
                                position: 'relative'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <Link to={`/read/${story.id}`} style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#3E2723', textDecoration: 'none' }}>
                                            {story.title}
                                            {story.status === 'draft' && <span style={{ color: '#d32f2f', fontSize: '0.8rem', marginLeft: '10px' }}>[DRAFT]</span>}
                                        </Link>
                                        <p style={{ margin: '5px 0', fontSize: '1.1rem' }}>By <strong>{story.author || 'Babysterek'}</strong></p>
                                    </div>

                                    {/* STATUS & CHAPTER COUNT */}
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#3E2723' }}>
                                            Chapters: {chapterCount}/{expected}
                                        </div>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            color: story.is_complete ? '#2e7d32' : '#ed6c02',
                                            textTransform: 'uppercase',
                                            marginTop: '5px',
                                            border: `1px solid ${story.is_complete ? '#2e7d32' : '#ed6c02'}`,
                                            padding: '2px 6px',
                                            display: 'inline-block',
                                            borderRadius: '3px'
                                        }}>
                                            {story.is_complete ? 'Completed' : 'On-going'}
                                        </div>
                                    </div>
                                </div>

                                <p style={{ color: '#5D4037', fontWeight: 'bold', fontSize: '0.9rem', margin: '15px 0' }}>
                                    {story.fandoms || 'Original Work'}
                                </p>

                                {story.summary && (
                                    <blockquote style={{
                                        fontSize: '0.95rem',
                                        borderLeft: '4px solid #3E2723',
                                        paddingLeft: '15px',
                                        margin: '15px 0',
                                        fontStyle: 'italic',
                                        color: '#444',
                                        lineHeight: '1.5'
                                    }}>
                                        {story.summary}
                                    </blockquote>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#888' }}>
                                        Registered: {new Date(story.created_at).toLocaleDateString()}
                                    </span>
                                    <Link to={`/read/${story.id}`} style={{
                                        fontWeight: 'bold',
                                        color: 'white',
                                        background: '#3E2723',
                                        padding: '8px 15px',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem'
                                    }}>
                                        OPEN FILE →
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ padding: '60px', textAlign: 'center', border: '2px dashed #3E2723', background: 'rgba(255,255,255,0.5)' }}>
                        <p style={{ fontSize: '1.2rem', color: '#3E2723' }}>Vault empty. No records found.</p>
                        {user?.isAdmin && <Link to="/post-work" style={{ color: '#3E2723', fontWeight: 'bold' }}>Initialize first entry?</Link>}
                    </div>
                )}
            </div>
        </div>
    );
}

// 🎨 Common style for navigation links
const navStyle = {
    color: '#3E2723',
    fontWeight: 'bold' as 'bold',
    textDecoration: 'none',
    fontSize: '0.9rem',
    border: '1px solid #3E2723',
    padding: '5px 12px',
    borderRadius: '4px',
    background: 'white'
};
