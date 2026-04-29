import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './Home.css';

export default function Home({ user }: any) {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            const { data, error } = await supabase
                .from('stories')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setStories(data);
            }
            setLoading(false);
        };
        fetchStories();
    }, []);

    return (
        <div className="home" style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
            <header className="home-header">
                <h1>FICVAULT ARCHIVE</h1>
                <p>Welcome back, {user.pseudo}. You are viewing the restricted collection.</p>

                <nav style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {user.isAdmin && (
                        <>
                            <Link to="/admin-portal" style={{ color: 'red', fontWeight: 'bold' }}>Admin Center</Link>
                            <Link to="/post-work" style={{ color: '#3E2723', fontWeight: 'bold' }}>Post New</Link>
                            {/* 🛠️ NEW LINK FOR MANAGING/EDITING */}
                            <Link to="/manage-stories" style={{ color: '#3E2723', fontWeight: 'bold', borderBottom: '2px solid #3E2723' }}>Manage Vault</Link>
                        </>
                    )}
                    <Link to="/my-stories">My Vault</Link>
                </nav>
            </header>

            <div className="home-filters">
                <button className="active">All Stories ({stories.length})</button>
            </div>

            <div className="story-list" style={{ marginTop: '30px' }}>
                {loading ? (
                    <p>Opening the vault...</p>
                ) : stories.length > 0 ? (
                    stories.map((story) => (
                        <div key={story.id} style={{
                            background: 'white',
                            padding: '20px',
                            border: '1px solid #3E2723',
                            marginBottom: '15px',
                            textAlign: 'left'
                        }}>
                            <h3 style={{ margin: 0 }}>{story.title}</h3>
                            <p style={{ fontSize: '0.8rem', color: '#666' }}>By {story.author}</p>
                            <Link
                                to={`/read/${story.id}`}
                                style={{ color: '#3E2723', fontWeight: 'bold', textDecoration: 'underline' }}
                            >
                                READ STORY →
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="empty">
                        <p>The archive is currently empty. Check back soon for new arrivals.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
