import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Comments({ storyId, chapterId, user, commentsEnabled }: any) {
    const [comments, setComments] = useState<any[]>([]);
    const [text, setText] = useState('');
    const [replyTo, setReplyTo] = useState<string | null>(null);

    const fetchComments = async () => {
        const { data } = await supabase.from('comments')
            .select('*')
            .eq('chapter_id', chapterId)
            .order('created_at', { ascending: true });
        if (data) setComments(data);
    };

    useEffect(() => { fetchComments(); }, [chapterId]);

    const postComment = async () => {
        if (!text.trim()) return;
        const { error } = await supabase.from('comments').insert([{
            story_id: storyId,
            chapter_id: chapterId,
            user_pseudo: user?.pseudo || 'Guest Visitor',
            content: text,
            parent_id: replyTo
        }]);
        if (!error) { setText(''); setReplyTo(null); fetchComments(); }
    };

    const deleteComment = async (id: string) => {
        if (window.confirm("Admin: Permanently delete this comment?")) {
            await supabase.from('comments').delete().eq('id', id);
            fetchComments();
        }
    };

    const reportComment = async (id: string) => {
        await supabase.from('comments').update({ is_reported: true }).eq('id', id);
        alert("⚠️ Flagged for Admin review.");
        fetchComments();
    };

    return (
        <div style={{ marginTop: '50px', borderTop: '2px solid #3E2723', paddingTop: '30px', textAlign: 'left' }}>
            <h3 style={{ fontFamily: 'serif' }}>COMMENTS ({comments.length})</h3>

            {/* ✍️ INPUT BOX */}
            {commentsEnabled ? (
                <div style={{ marginBottom: '30px' }}>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={replyTo ? "Writing a reply..." : "Leave a comment..."}
                        style={{ width: '100%', height: '80px', padding: '10px', border: '1px solid #3E2723', boxSizing: 'border-box' }}
                    />
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                        <button onClick={postComment} style={btnStyle}>POST COMMENT</button>
                        {replyTo && <button onClick={() => setReplyTo(null)} style={{ background: '#ccc', border: 'none', padding: '5px 15px', cursor: 'pointer' }}>Cancel Reply</button>}
                    </div>
                </div>
            ) : (
                <p style={{ fontStyle: 'italic', color: '#666' }}>🔒 Commenting is restricted.</p>
            )}

            {/* 💬 COMMENT LIST */}
            {comments.map(c => (
                <div key={c.id} style={{
                    padding: '15px', border: '1px solid #eee', marginBottom: '10px',
                    marginLeft: c.parent_id ? '40px' : '0',
                    background: c.is_reported ? '#fff0f0' : 'white',
                    boxShadow: '2px 2px 0px #eee'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <strong>{c.user_pseudo} {c.is_reported && <span style={{ color: 'red' }}>⚠️ [FLAGGED]</span>}</strong>
                        <span>{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                    <p style={{ margin: '10px 0', fontSize: '0.95rem' }}>{c.content}</p>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        {commentsEnabled && <button onClick={() => setReplyTo(c.id)} style={linkBtn}>Reply</button>}

                        {/* Users can report, Admin can delete */}
                        {!user?.isAdmin ? (
                            <button onClick={() => reportComment(c.id)} style={linkBtn}>Report</button>
                        ) : (
                            <button onClick={() => deleteComment(c.id)} style={{ ...linkBtn, color: 'red' }}>Delete</button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

const btnStyle = { background: '#3E2723', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' as 'bold' };
const linkBtn = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline', color: '#3E2723', padding: 0 };
