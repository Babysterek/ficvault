import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Home({ user }: any) {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            let query = supabase.from('stories').select('*');

            // 🕵️ Only show drafts if the user is the Admin
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
            <header style={{ borderBottom: '3px solid #3E2723', marginBottom: '30px', paddingBottom: '10px' }}>
                <h1 style={{ color: '#3E2723', fontFamily: 'serif', fontSize: '2.5rem', margin: 0 }}>FICVAULT ARCHIVE</h1>
                <nav style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                    {user?.isAdmin && <Link to="/post-work" style={{ color: '#3E2723', fontWeight: 'bold' }}>+ Post New Work</Link>}
                    {user?.isAdmin && <Link to="/manage-stories" style={{ color: '#3E2723', fontWeight: 'bold' }}>Manage Vault</Link>}
                    <Link to="/my-stories" style={{ color: '#3E2723' }}>My Vault</Link>
                </nav>
            </header>

            <div>
                {loading ? (
                    <p>Accessing records...</p>
                ) : stories.length > 0 ? (
                    stories.map((story) => (
                        <div key={story.id} style={{
                            background: 'white',
                            padding: '20px',
                            border: '1px solid #3E2723',
                            boxShadow: '5px 5px 0px #3E2723',
                            marginBottom: '20px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Link to={`/read/${story.id}`} style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3E2723', textDecoration: 'none' }}>
                                    {story.title} {story.status === 'draft' && <span style={{ color: 'red', fontSize: '0.8rem' }}>(DRAFT)</span>}
                                </Link>
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
