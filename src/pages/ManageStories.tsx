import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

export default function ManageStories() {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStories = async () => {
        setLoading(true);
        // 🧠 Logic: Gets stories AND all their chapters in one clean list
        const { data } = await supabase
            .from('stories')
            .select('*, chapters(id, chapter_number, title)')
            .order('created_at', { ascending: false });

        if (data) setStories(data);
        setLoading(false);
    };

    useEffect(() => { fetchStories(); }, []);

    const deleteStory = async (id: string, title: string) => {
        if (window.confirm(`🚨 NUCLEAR OPTION: Delete entire work "${title}" and all its chapters?`)) {
            await supabase.from('stories').delete().eq('id', id);
            fetchStories();
        }
    };

    const deleteChapter = async (id: string) => {
        if (window.confirm("Delete this specific chapter?")) {
            await supabase.from('chapters').delete().eq('id', id);
            fetchStories();
        }
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{
                background: 'white',
                padding: '40px',
                maxWidth: '1000px',
                margin: 'auto',
                border: '2px solid #3E2723',
                boxShadow: '10px 10px 0px #3E2723',
                textAlign: 'left'
            }}>
                <header style={{ borderBottom: '3px solid #3E2723', paddingBottom: '10px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontFamily: 'serif', margin: 0 }}>VAULT MANAGEMENT</h1>
                    <Link to="/archive" style={{ fontWeight: 'bold', color: '#3E2723' }}>← BACK TO ARCHIVE</Link>
                </header>

                {/* 📥 QUICK IMPORT BUTTONS */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
                    <Link to="/post-word" className="manage-btn">📥 IMPORT WORD</Link>
                    <Link to="/post-epub" className="manage-btn">📔 IMPORT EPUB</Link>
                    <Link to="/post-work" className="manage-btn">+ MANUAL POST</Link>
                </div>

                {loading ? (
                    <p style={{ fontStyle: 'italic' }}>Scanning vault sectors...</p>
                ) : stories.map(s => (
                    <div key={s.id} style={{
                        border: '1px solid #3E2723',
                        padding: '20px',
                        marginBottom: '30px',
                        background: '#fcfcfc'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <h3 style={{ margin: 0, color: '#3E2723' }}>{s.title}</h3>
                            <button
                                onClick={() => deleteStory(s.id, s.title)}
                                style={{ color: 'red', border: '1px solid red', background: 'none', cursor: 'pointer', padding: '5px 10px', fontWeight: 'bold' }}
                            >
                                DELETE ENTIRE WORK
                            </button>
                        </div>

                        {/* 📚 CHAPTER LIST */}
                        <div style={{ marginTop: '15px' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888', textTransform: 'uppercase' }}>Chapter Records:</p>
                            {s.chapters?.sort((a: any, b: any) => a.chapter_number - b.chapter_number).map((ch: any) => (
                                <div key={ch.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '10px',
                                    borderBottom: '1px solid #eee',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontSize: '0.95rem' }}>
                                        <strong>Ch {ch.chapter_number}:</strong> {ch.title || 'Untitled Chapter'}
                                    </span>
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <Link
                                            to={`/edit-chapter/${ch.id}`}
                                            style={{ color: '#3E2723', fontWeight: 'bold', textDecoration: 'none', borderBottom: '1px solid #3E2723' }}
                                        >
                                            EDIT TEXT
                                        </Link>
                                        <button
                                            onClick={() => deleteChapter(ch.id)}
                                            style={{ color: '#999', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .manage-btn {
                    background: #3E2723;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 0.8rem;
                    border: 1px solid #3E2723;
                }
                .manage-btn:hover {
                    background: white;
                    color: #3E2723;
                }
            `}</style>
        </div>
    );
}
