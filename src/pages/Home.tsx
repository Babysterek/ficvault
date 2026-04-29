import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Home({ user }: any) {
    const [stories, setStories] = useState<any[]>([]);

    useEffect(() => {
        const fetchStories = async () => {
            let query = supabase.from('stories').select('*, chapters(id)');
            if (!user?.isAdmin) query = query.eq('status', 'published');
            const { data } = await query.order('created_at', { ascending: false });
            if (data) setStories(data);
        };
        fetchStories();
    }, [user]);

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px', textAlign: 'left' }}>
            <header style={{ borderBottom: '3px solid #3E2723', paddingBottom: '20px', marginBottom: '30px' }}>
                <h1 style={{ color: '#3E2723', fontFamily: 'serif' }}>FICVAULT ARCHIVE</h1>
                <nav style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    {user?.isAdmin && <Link to="/post-work" className="nav-btn">+ New</Link>}
                    <Link to="/my-stories" className="nav-btn">Bookmarks</Link>
                    <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="nav-btn">Logout</button>
                </nav>
            </header>

            {stories.map(story => (
                <div key={story.id} style={{ background: 'white', padding: '25px', border: '1px solid #3E2723', boxShadow: '5px 5px 0 #3E2723', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Link to={`/read/${story.id}`} style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3E2723', textDecoration: 'none' }}>
                            {story.title}
                        </Link>
                        {/* 📊 CHAPTER COUNT & STATUS */}
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold' }}>{story.chapters?.length || 0}/{story.expected_chapters || '?'}</div>
                            <span style={{ fontSize: '0.7rem', color: story.is_complete ? 'green' : 'orange', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                {story.is_complete ? '● Completed' : '○ Ongoing'}
                            </span>
                        </div>
                    </div>
                    <p>By <strong>{story.author}</strong></p>
                    <p style={{ fontStyle: 'italic', color: '#666' }}>{story.summary}</p>
                    <div style={{ textAlign: 'right', marginTop: '15px' }}>
                        <Link to={`/read/${story.id}`} style={{ background: '#3E2723', color: 'white', padding: '8px 15px', textDecoration: 'none' }}>OPEN FILE →</Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
