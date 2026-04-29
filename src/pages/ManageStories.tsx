import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

export default function ManageStories() {
    const [stories, setStories] = useState<any[]>([]);

    const fetchStories = async () => {
        const { data } = await supabase.from('stories').select('*');
        if (data) setStories(data);
    };

    useEffect(() => { fetchStories(); }, []);

    const deleteStory = async (id: string) => {
        if (window.confirm("Are you sure? This deletes the story and all chapters!")) {
            await supabase.from('stories').delete().eq('id', id);
            fetchStories();
        }
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div className="vault-card" style={{ background: 'white', padding: '20px', maxWidth: '800px', margin: 'auto' }}>
                <h2>MANAGE VAULT CONTENT</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #3E2723' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Story Title</th>
                            <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stories.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{s.title}</td>
                                <td style={{ padding: '10px', textAlign: 'right' }}>
                                    <Link to="/post-chapter" style={{ marginRight: '10px', color: 'blue' }}>+ Add Chapter</Link>
                                    <button onClick={() => deleteStory(s.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Link to="/archive" style={{ display: 'block', marginTop: '20px' }}>← Back to Archive</Link>
            </div>
        </div>
    );
}
