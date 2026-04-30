import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import StoryCard from '../components/StoryCard';

export default function Home({ user }: any) {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            // 📊 Logic: Fetches stories + chapter details for progress and word counts
            let query = supabase
                .from('stories')
                .select(`
                    *,
                    chapters (id, is_published, word_count)
                `);

            // 🔐 HIDE DRAFTS: Only Babysterek (Admin) can see stories with status 'draft'
            if (!user?.isAdmin) {
                query = query.eq('status', 'published');
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (!error && data) {
                // 🧠 Process stories to calculate live stats before setting state
                const processedStories = data.map(story => {
                    // Only count chapters that are actually marked as live
                    const liveChapters = story.chapters?.filter((c: any) => c.is_published).length || 0;
                    const totalWords = story.chapters?.reduce((sum: number, c: any) => sum + (c.word_count || 0), 0) || 0;

                    return {
                        ...story,
                        live_chapter_count: liveChapters,
                        total_word_count: totalWords
                    };
                });
                setStories(processedStories);
            }
            setLoading(false);
        };
        fetchStories();
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('ficvault_user');
        window.location.reload();
    };

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px', textAlign: 'left', minHeight: '100vh' }}>
            <header style={{ borderBottom: '4px solid #3E2723', marginBottom: '40px', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ color: '#3E2723', fontFamily: 'serif', fontSize: '3rem', margin: 0 }}>FICVAULT</h1>
                    <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #3E2723', color: '#3E2723', padding: '5px 15px', cursor: 'pointer', fontWeight: 'bold' }}>LOGOUT</button>
                </div>

                <p style={{ margin: '10px 0', fontSize: '0.9rem', color: '#666' }}>
                    Authenticated as: <strong>{user?.pseudo || 'Guest'}</strong> {user?.isAdmin && <span style={{ color: '#2e7d32' }}>(ADMIN)</span>}
                </p>

                {/* 🧭 NAVIGATION BAR */}
                <nav style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                    {user?.isAdmin ? (
                        <>
                            <Link to="/post-work" className="nav-btn-admin">+ NEW WORK</Link>
                            <Link to="/post-word" className="nav-btn-admin">📥 WORD IMPORT</Link>
                            <Link to="/post-epub" className="nav-btn-admin">📔 EPUB IMPORT</Link>
                            <Link to="/manage-stories" className="nav-btn-admin">⚙️ MANAGE VAULT</Link>
                            <Link to="/admin-portal" className="nav-btn-admin">🔑 ADMIN PORTAL</Link>
                            <Link to="/my-stories" style={userNavBtn}>🔖 BOOKMARKS</Link>
                            <Link to="/my-subscriptions" className="nav-btn-admin">🔔 MY SUBSCRIPTIONS</Link>
                            
                        </>
                    ) : (
                        <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#3E2723' }}>Archive Access Level: Standard</p>
                    )}
                    <Link to="/my-stories" style={userNavBtn}>🔖 BOOKMARKS</Link>
                </nav>
            </header>

            <div className="vault-list">
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '50px', fontStyle: 'italic' }}>Accessing Vault Sectors...</p>
                ) : stories.length > 0 ? (
                    stories.map((story) => (
                        <StoryCard key={story.id} story={story} />
                    ))
                ) : (
                    <div style={{ padding: '60px', textAlign: 'center', border: '2px dashed #3E2723', background: 'rgba(255,255,255,0.5)' }}>
                        <p style={{ fontSize: '1.2rem', color: '#3E2723' }}>No published records found.</p>
                    </div>
                )}
            </div>

            <style>{`
                .nav-btn-admin {
                    background: #3E2723;
                    color: white;
                    padding: 8px 15px;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 0.8rem;
                    border: 1px solid #3E2723;
                }
                .nav-btn-admin:hover {
                    background: white;
                    color: #3E2723;
                }
            `}</style>
        </div>
    );
}

const userNavBtn = {
    background: 'white',
    color: '#3E2723',
    padding: '8px 15px',
    textDecoration: 'none',
    fontWeight: 'bold' as 'bold',
    fontSize: '0.8rem',
    border: '1px solid #3E2723'
};
