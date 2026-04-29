import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

export default function ManageStories() {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            // 🧠 This gets stories AND their specific chapters
            const { data } = await supabase
                .from('stories')
                .select('*, chapters(id, chapter_number, title)')
                .order('created_at', { ascending: false });
            if (data) setStories(data);
            setLoading(false);
        };
        fetchStories();
    }, []);

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '30px', maxWidth: '900px', margin: 'auto', border: '2px solid #3E2723', textAlign: 'left' }}>
                <h2 style={{ borderBottom: '2px solid #3E2723', paddingBottom: '10px' }}>VAULT MANAGEMENT</h2>
                <Link to="/archive" style={{ color: '#3E2723', fontWeight: 'bold' }}>← BACK TO ARCHIVE</Link>

                {loading ? <p>Loading Vault Records...</p> : stories.map(story => (
                    <div key={story.id} style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
                        <h3 style={{ margin: '0 0 10px 0' }}>{story.title}</h3>

                        <div style={{ background: '#f9f9f9', padding: '10px', borderLeft: '4px solid #3E2723' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '10px' }}>SELECT CHAPTER TO EDIT:</p>
                            {story.chapters?.sort((a: any, b: any) => a.chapter_number - b.chapter_number).map((ch: any) => (
                                <div key={ch.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                                    <span>Chapter {ch.chapter_number}: {ch.title || 'Untitled'}</span>
                                    {/* 🌟 THIS LINK GOES TO THE EDITOR PAGE */}
                                    <Link
                                        to={`/edit-chapter/${ch.id}`}
                                        style={{ fontWeight: 'bold', color: '#3E2723', textDecoration: 'none', background: '#eee', padding: '2px 8px' }}
                                    >
                                        EDIT TEXT →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
