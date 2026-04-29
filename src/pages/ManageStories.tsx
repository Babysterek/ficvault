import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

export default function ManageStories() {
    const [stories, setStories] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');

    const fetchStories = async () => {
        const { data } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
        if (data) setStories(data);
    };

    useEffect(() => { fetchStories(); }, []);

    const saveTitle = async (id: string) => {
        await supabase.from('stories').update({ title: newTitle }).eq('id', id);
        setEditingId(null);
        fetchStories();
    };

    const deleteStory = async (id: string) => {
        if (window.confirm("Danger! This deletes the story and ALL its chapters forever. Proceed?")) {
            await supabase.from('stories').delete().eq('id', id);
            fetchStories();
        }
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div className="vault-card" style={{ background: 'white', padding: '20px', maxWidth: '900px', margin: 'auto', border: '2px solid #3E2723' }}>
                <h2 style={{ fontFamily: 'serif' }}>VAULT MANAGEMENT</h2>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #3E2723', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Work Title</th>
                            <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stories.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>
                                    {editingId === s.id ? (
                                        <input
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            style={{ padding: '5px', border: '1px solid #3E2723' }}
                                        />
                                    ) : (
                                        <strong>{s.title}</strong>
                                    )}
                                </td>
                                <td style={{ padding: '10px', textAlign: 'right' }}>
                                    {editingId === s.id ? (
                                        <button onClick={() => saveTitle(s.id)} style={{ background: 'green', color: 'white', marginRight: '5px' }}>Save</button>
                                    ) : (
                                        <button onClick={() => { setEditingId(s.id); setNewTitle(s.title); }} style={{ marginRight: '5px' }}>Edit Title</button>
                                    )}

                                    <Link to="/post-chapter" style={{
                                        marginRight: '10px',
                                        padding: '5px 10px',
                                        background: '#3E2723',
                                        color: 'white',
                                        textDecoration: 'none',
                                        fontSize: '0.8rem'
                                    }}>
                                        + Add Chapter
                                    </Link>

                                    <button onClick={() => deleteStory(s.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Link to="/archive" style={{ display: 'block', marginTop: '30px', color: '#3E2723' }}>← Back to Archive</Link>
            </div>
        </div>
    );
}
