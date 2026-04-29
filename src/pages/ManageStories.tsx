import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

export default function ManageStories() {
    const [stories, setStories] = useState<any[]>([]);

    const fetchStories = async () => {
        const { data } = await supabase.from('stories').select('*, chapters(*)').order('created_at', { ascending: false });
        if (data) setStories(data);
    };

    useEffect(() => { fetchStories(); }, []);

    const deleteStory = async (id: string) => {
        if (window.confirm("🚨 DELETE ENTIRE WORK? This cannot be undone.")) {
            await supabase.from('stories').delete().eq('id', id);
            fetchStories();
        }
    };

    const deleteChapter = async (id: string) => {
        if (window.confirm("Delete this chapter?")) {
            await supabase.from('chapters').delete().eq('id', id);
            fetchStories();
        }
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '30px', maxWidth: '1000px', margin: 'auto', border: '2px solid #3E2723', textAlign: 'left' }}>
                <h2 style={{ fontFamily: 'serif' }}>VAULT MANAGEMENT</h2>
                <Link to="/archive">← Back to Archive</Link>

                {stories.map(s => (
                    <div key={s.id} style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>{s.title}</h3>
                            <button onClick={() => deleteStory(s.id)} style={{ color: 'red', cursor: 'pointer', border: 'none', background: 'none' }}>DELETE STORY</button>
                        </div>
                        <div style={{ marginTop: '10px', background: '#f9f9f9', padding: '10px' }}>
                            {s.chapters?.sort((a: any, b: any) => a.chapter_number - b.chapter_number).map((ch: any) => (
                                <div key={ch.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                                    <span>Ch {ch.chapter_number}: {ch.title}</span>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <Link to={`/edit-chapter/${ch.id}`} style={{ fontWeight: 'bold', color: '#3E2723' }}>[EDIT]</Link>
                                        <button onClick={() => deleteChapter(ch.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>[REMOVE]</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
