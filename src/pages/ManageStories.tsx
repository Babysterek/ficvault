import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

export default function ManageStories() {
    const [stories, setStories] = useState<any[]>([]);

    const fetchStories = async () => {
        const { data } = await supabase
            .from('stories')
            .select('*, chapters(id, chapter_number, title, is_published, word_count)')
            .order('created_at', { ascending: false });
        if (data) setStories(data);
    };

    useEffect(() => { fetchStories(); }, []);

    const toggleChapter = async (id: string, currentStatus: boolean) => {
        await supabase.from('chapters').update({ is_published: !currentStatus }).eq('id', id);
        fetchStories();
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh', textAlign: 'left' }}>
            <div style={{ background: 'white', padding: '30px', maxWidth: '1000px', margin: 'auto', border: '2px solid #3E2723' }}>
                <h2>VAULT MANAGEMENT</h2>
                {stories.map(s => (
                    <div key={s.id} style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
                        <h3>{s.title}</h3>
                        <div style={{ background: '#f9f9f9', padding: '10px' }}>
                            {s.chapters?.sort((a: any, b: any) => a.chapter_number - b.chapter_number).map((ch: any) => (
                                <div key={ch.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ddd' }}>
                                    <span>
                                        <strong>Ch {ch.chapter_number}:</strong> {ch.word_count || 0} words
                                    </span>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => toggleChapter(ch.id, ch.is_published)}
                                            style={{ background: ch.is_published ? '#2e7d32' : '#ccc', color: 'white', border: 'none', cursor: 'pointer', padding: '2px 10px' }}
                                        >
                                            {ch.is_published ? 'LIVE' : 'DRAFT'}
                                        </button>
                                        <Link to={`/edit-chapter/${ch.id}`}>[EDIT]</Link>
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
