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
                <h1 style={{ color: '#3E2723', fontFamily: 'serif', fontSize: '2.8rem', margin: 0 }}>FICVAULT ARCHIVE</h1>
                <nav style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
                    {user?.isAdmin && (
                        <>
                            <Link to="/post-work" className="nav-btn">Manual Post</Link>
                            <Link to="/post-word" className="nav-btn">Word Import</Link>
                            <Link to="/post-epub" className="nav-btn">EPUB Import</Link>
                            <Link to="/manage-stories" className="nav-btn">Manage Vault</Link>
                        </>
                    )}
                </nav>
            </header>

            {loading ? <p>Scanning Vault...</p> : stories.map(story => (
                <div key={story.id} style={{ background: 'white', padding: '25px', border: '1px solid #3E2723', boxShadow: '6px 6px 0px #3E2723', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Link to={`/read/${story.id}`} style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#3E2723', textDecoration: 'none' }}>
                            {story.title} {story.status === 'draft' && <span style={{ color: 'red' }}>[DRAFT]</span>}
                        </Link>
                        <div style={{ textAlign: 'right' }}>
                            <b>Chapters: {story.chapters?.length || 0}/{story.expected_chapters || '?'}</b>
                        </div>
                    </div>
                    <p>By <b>{story.author}</b></p>
                    <p style={{ fontStyle: 'italic', color: '#666' }}>{story.summary}</p>
                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        {/* 🌟 THIS LINK GOES TO THE CLEAN READER */}
                        <Link to={`/read/${story.id}`} style={{ background: '#3E2723', color: 'white', padding: '10px 20px', textDecoration: 'none', fontWeight: 'bold' }}>
                            OPEN FILE →
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
