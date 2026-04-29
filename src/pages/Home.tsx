import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Home({ user }: any) {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            let query = supabase.from('stories').select('*, chapters(id)');
            if (!user?.isAdmin) query = query.eq('status', 'published');
            const { data } = await query.order('created_at', { ascending: false });
            if (data) setStories(data);
            setLoading(false);
        };
        fetchStories();
    }, [user]);

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px', textAlign: 'left' }}>
            <header style={{ borderBottom: '3px solid #3E2723', marginBottom: '30px', paddingBottom: '20px' }}>
                <h1 style={{ color: '#3E2723', fontFamily: 'serif', fontSize: '2.8rem', margin: 0 }}>FICVAULT</h1>
                <nav style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                    {user?.isAdmin && (
                        <>
                            <Link to="/post-work" className="admin-btn">Manual</Link>
                            <Link to="/post-word" className="admin-btn">Word</Link>
                            <Link to="/post-epub" className="admin-btn">EPUB</Link>
                            <Link to="/manage-stories" className="admin-btn">Manage</Link>
                        </>
                    )}
                    <Link to="/my-stories" className="user-btn">Bookmarks</Link>
                    <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="user-btn">Logout</button>
                </nav>
            </header>

            {stories.map(story => (
                <div key={story.id} style={{ background: 'white', padding: '20px', border: '1px solid #3E2723', marginBottom: '20px', boxShadow: '4px 4px 0 #3E2723' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Link to={`/read/${story.id}`} style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3E2723', textDecoration: 'none' }}>
                            {story.title} {story.status === 'draft' && <span style={{ color: 'red' }}> [DRAFT]</span>}
                        </Link>
                        <span>{story.chapters?.length || 0}/{story.expected_chapters || '?'} Chaps</span>
                    </div>
                    <p>By {story.author}</p>
                    <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>{story.summary}</p>
                    <div style={{ textAlign: 'right' }}>
                        <Link to={`/read/${story.id}`} style={{ background: '#3E2723', color: 'white', padding: '8px 15px', textDecoration: 'none' }}>OPEN FILE</Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
