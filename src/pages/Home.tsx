import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

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
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px', textAlign: 'left', minHeight: '100vh' }}>
            <header style={{ borderBottom: '3px solid #3E2723', marginBottom: '30px', paddingBottom: '10px' }}>
                <h1 style={{ color: '#3E2723', fontFamily: 'serif', fontSize: '2.5rem', margin: 0 }}>FICVAULT ARCHIVE</h1>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>Secure digital collection. Access granted to: <strong>{user?.pseudo || 'Authorized User'}</strong></p>

                <nav style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                    {user?.isAdmin && <Link to="/post-work" style={{ color: '#3E2723', fontWeight: 'bold' }}>+ Post New Work</Link>}
                    {user?.isAdmin && <Link to="/manage-stories" style={{ color: '#3E2723', fontWeight: 'bold' }}>Manage Vault</Link>}
                    <Link to="/my-stories" style={{ color: '#3E2723' }}>My Bookmarks</Link>
                </nav>
            </header>

            <div className="vault-list">
                {loading ? (
                    <p style={{ fontStyle: 'italic' }}>Opening the vault and decrypting files...</p>
                ) : stories.length > 0 ? (
                    stories.map((story) => (
                        <div key={story.id} style={{
                            background: 'white',
                            padding: '25px',
                            border: '1px solid #3E2723',
                            boxShadow: '5px 5px 0px #3E2723',
                            marginBottom: '30px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Link to={`/read/${story.id}`} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3E2723', textDecoration: 'none' }}>
                                    {story.title}
                                </Link>
                                <span style={{ fontSize: '0.7rem', border: '1px solid #3E2723', padding: '2px 5px', fontWeight: 'bold' }}>
                                    {story.rating?.toUpperCase() || 'NOT RATED'}
                                </span>
                            </div>

                            <p style={{ margin: '5px 0', fontSize: '1rem' }}>By <strong>{story.author}</strong></p>
                            <p style={{ color: '#5D4037', fontWeight: 'bold', fontSize: '0.85rem', margin: '10px 0' }}>{story.fandoms}</p>

                            <div style={{ fontSize: '0.8rem', color: '#333', background: '#f9f9f9', padding: '10px', borderLeft: '3px solid #3E2723' }}>
                                <strong>Warnings:</strong> {story.archive_warnings} <br />
                                <strong>Relationships:</strong> {story.relationships} <br />
                                <strong>Characters:</strong> {story.characters}
                            </div>

                            {story.summary && (
                                <p style={{ fontSize: '0.9rem', marginTop: '15px', color: '#444', fontStyle: 'italic' }}>
                                    {story.summary}
                                </p>
                            )}

                            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.7rem', color: '#888' }}>Tags: {story.additional_tags}</span>
                                <Link to={`/read/${story.id}`} style={{ fontWeight: 'bold', color: '#3E2723', textDecoration: 'underline' }}>ACCESS FILE →</Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', border: '2px dashed #3E2723' }}>
                        <p>The vault is currently empty. No records found.</p>
                        {user?.isAdmin && <Link to="/post-work">Initialize first record?</Link>}
                    </div>
                )}
            </div>
        </div>
    );
}
