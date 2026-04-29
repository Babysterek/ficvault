import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

export default function ManageStories() {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStories = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('stories')
            .select('*, chapters(id, chapter_number, title, is_published, word_count)')
            .order('created_at', { ascending: false });
        if (data) setStories(data);
        setLoading(false);
    };

    useEffect(() => { fetchStories(); }, []);

    // 🌟 Manual update for "Max Chapters" (e.g., changes 1/? to 1/15)
    const updateExpected = async (id: string, val: string) => {
        await supabase.from('stories').update({ expected_chapters: val }).eq('id', id);
        fetchStories();
    };

    // 🌟 Toggle specific chapters between Live and Draft
    const toggleChapter = async (id: string, currentStatus: boolean) => {
        await supabase.from('chapters').update({ is_published: !currentStatus }).eq('id', id);
        fetchStories();
    };

    const deleteStory = async (id: string, title: string) => {
        if (window.confirm(`🚨 NUCLEAR OPTION: Delete entire work "${title}"?`)) {
            await supabase.from('stories').delete().eq('id', id);
            fetchStories();
        }
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh', textAlign: 'left' }}>
            <div style={{ background: 'white', padding: '30px', maxWidth: '1000px', margin: 'auto', border: '2px solid #3E2723', boxShadow: '10px 10px 0px #3E2723' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #3E2723', paddingBottom: '10px' }}>
                    <h2 style={{ fontFamily: 'serif', margin: 0 }}>VAULT MANAGEMENT</h2>
                    <Link to="/archive" style={{ fontWeight: 'bold', color: '#3E2723' }}>← BACK TO ARCHIVE</Link>
                </div>

                {loading ? <p style={{ marginTop: '20px' }}>Accessing records...</p> : stories.map(s => (
                    <div key={s.id} style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px', background: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>{s.title}</h3>
                                <p style={{ fontSize: '0.8rem', color: '#666' }}>Story ID: {s.id}</p>
                            </div>

                            {/* 📊 MANUAL CHAPTER UPDATE */}
                            <div style={{ textAlign: 'right' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>MAX CHAPTERS: </label>
                                <input
                                    defaultValue={s.expected_chapters || '?'}
                                    onBlur={(e) => updateExpected(s.id, e.target.value)}
                                    style={{ width: '50px', textAlign: 'center', padding: '5px', border: '1px solid #3E2723' }}
                                />
                                <br />
                                <button
                                    onClick={() => deleteStory(s.id, s.title)}
                                    style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', marginTop: '10px', textDecoration: 'underline' }}
                                >
                                    DELETE WORK
                                </button>
                            </div>
                        </div>

                        {/* 📚 CHAPTER LIST */}
                        <div style={{ background: '#f9f9f9', padding: '15px', marginTop: '15px', borderLeft: '4px solid #3E2723' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '10px', textTransform: 'uppercase' }}>Chapter Control:</p>
                            {s.chapters?.sort((a: any, b: any) => a.chapter_number - b.chapter_number).map((ch: any) => (
                                <div key={ch.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                                    <span>
                                        <strong>Ch {ch.chapter_number}:</strong> {ch.word_count || 0} words
                                    </span>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <button
                                            onClick={() => toggleChapter(ch.id, ch.is_published)}
                                            style={{
                                                background: ch.is_published ? '#2e7d32' : '#777',
                                                color: 'white',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '4px 12px',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {ch.is_published ? '● LIVE' : '○ DRAFT'}
                                        </button>
                                        <Link to={`/edit-chapter/${ch.id}`} style={{ fontWeight: 'bold', color: '#3E2723', textDecoration: 'none', fontSize: '0.85rem' }}>[EDIT]</Link>
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
