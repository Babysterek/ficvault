import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

export default function ManageStories() {
    const [stories, setStories] = useState<any[]>([]);

    const fetch = async () => {
        const { data } = await supabase.from('stories').select('*, chapters(*)').order('created_at', { ascending: false });
        if (data) setStories(data);
    };

    useEffect(() => { fetch(); }, []);

    const delStory = async (id: string) => {
        if (window.confirm("DELETE ENTIRE WORK?")) {
            await supabase.from('stories').delete().eq('id', id);
            fetch();
        }
    };

    return (
        <div style={{ padding: '40px', textAlign: 'left' }}>
            <h2>MANAGE VAULT</h2>
            {stories.map(s => (
                <div key={s.id} style={{ border: '1px solid #3E2723', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>{s.title}</h3>
                        <button onClick={() => delStory(s.id)} style={{ color: 'red' }}>DELETE WORK</button>
                    </div>
                    {s.chapters?.sort((a: any, b: any) => a.chapter_number - b.chapter_number).map((ch: any) => (
                        <div key={ch.id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <span>Chapter {ch.chapter_number}</span>
                            <Link to={`/edit-chapter/${ch.id}`}>[EDIT TEXT]</Link>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
