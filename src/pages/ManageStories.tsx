import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

export default function ManageStories() {
    const [stories, setStories] = useState<any[]>([]);

    const fetchStories = async () => {
        // 🧠 Logic: Gets stories AND their chapters in one go
        const { data } = await supabase
            .from('stories')
            .select('*, chapters(id, chapter_number, title)')
            .order('created_at', { ascending: false });
        if (data) setStories(data);
    };

    useEffect(() => { fetchStories(); }, []);

    const deleteStory = async (id: string) => {
        if (window.confirm("Delete this entire work and all its chapters?")) {
            await supabase.from('stories').delete().eq('id', id);
            fetchStories();
        }
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '30px', maxWidth: '900px', margin: 'auto', border: '2px solid #3E2723' }}>
                <h2 style={{ fontFamily: 'serif' }}>VAULT MANAGEMENT</h2>
                <Link to="/archive" style={{ display: 'block', marginBottom: '20px' }}>← Back to Archive</Link>

                {stories.map(s => (
                    <div key={s.id} style={{ border: '1px solid #eee', padding: '20px', marginBottom: '20px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>{s.title}</h3>
                            <button onClick={() => deleteStory(s.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete Work</button>
                        </div>

                        <div style={{ marginTop: '15px', padding: '10px', background: '#f9f9f9' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>CHAPTERS:</p>
                            {s.chapters?.sort((a: any, b: any) => a.chapter_number - b.chapter_number).map((ch: any) => (
                                <div key={ch.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #ddd' }}>
                                    <span>Ch {ch.chapter_number}: {ch.title || 'Untitled'}</span>
                                    <Link to={`/edit-chapter/${ch.id}`} style={{ fontWeight: 'bold', color: '#3E2723', textDecoration: 'none' }}>[EDIT TEXT]</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
