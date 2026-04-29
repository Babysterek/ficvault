import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Home({ user }: any) {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            // 📊 Logic: Gets stories and their chapter counts
            let query = supabase.from('stories').select('*, chapters(id)');
            if (!user?.isAdmin) {
                query = query.eq('status', 'published');
            }
            const { data } = await query.order('created_at', { ascending: false });
            if (data) setStories(data);
            setLoading(false);
        };
        fetchStories();
    }, [user]);

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px', textAlign: 'left', minHeight: '100vh' }}>
            <header style={{ borderBottom: '3px solid #3E2723', marginBottom: '30px', paddingBottom: '20px' }}>
                <h1 style={{ color: '#3E2723', fontFamily: 'serif', fontSize: '2.5rem', margin: 0 }}>FICVAULT ARCHIVE</h1>

                {/* 🧭 NAVIGATION WITH ALL YOUR BUTTONS */}
                <nav style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {user?.isAdmin && (
                        <>
                            <Link to="/post-work" style={btnStyle}>+ New</Link>
                            <Link to="/post-word" style={btnStyle}>📥 Word Import</Link>
                            <Link to="/post-epub" style={btnStyle}>📔 EPUB Import</Link>
                            <Link to="/manage-stories" style={btnStyle}>⚙️ Manage Vault</Link>
                        </>
                    )}
                    <Link to="/my-stories" style={{ color: '#3E2723', fontWeight: 'bold', textDecoration: 'none' }}>Bookmarks</Link>
                    <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ background: '#eee', border: '1px solid #ccc', padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
                </nav>
            </header>

            <div>
                {loading ? (
                    <p>Accessing records...</p>
                ) : stories.length > 0 ? (
                    stories.map((story) => (
                        <div key={story.id} style={{ background: 'white', padding: '20px', border: '1px solid #3E2723', boxShadow: '5px 5px 0px #3E2723', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Link to={`/read/${story.id}`} style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3E2723', textDecoration: 'none' }}>
                                    {story.title} {story.status === 'draft' && <span style={{ color: 'red', fontSize: '0.8rem' }}>(DRAFT)</span>}
                                </Link>
                                <div style={{ textAlign: 'right', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                    Chapters: {story.chapters?.length || 0}/{story.expected_chapters || '?'}
                                </div>
                            </div>
                            <p style={{ margin: '5px 0' }}>By <strong>{story.author}</strong></p>
                            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#666' }}>{story.summary}</p>
                            <Link to={`/read/${story.id}`} style={{ display: 'block', marginTop: '10px', fontWeight: 'bold', color: '#3E2723' }}>READ STORY →</Link>
                        </div>
                    ))
                ) : (
                    <p>The vault is empty.</p>
                )}
            </div>
        </div>
    );
}

// 🎨 Reusable button style
const btnStyle = {
    color: '#3E2723',
    fontWeight: 'bold' as 'bold',
    textDecoration: 'none',
    border: '1px solid #3E2723',
    padding: '5px 10px',
    fontSize: '0.9rem',
    borderRadius: '4px'
};
