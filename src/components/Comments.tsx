import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Comments({ storyId, chapterId, user, commentsEnabled }: any) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyId] = useState<string | null>(null);

    const fetchComments = async () => {
        const { data } = await supabase
            .from('comments')
            .select('*')
            .eq('chapter_id', chapterId)
            .order('created_at', { ascending: true });
        if (data) setComments(data);
    };

    useEffect(() => { fetchComments(); }, [chapterId]);

    const postComment = async () => {
        if (!newComment.trim()) return;
        const { error } = await supabase.from('comments').insert([{
            story_id: storyId,
            chapter_id: chapterId,
            user_id: user?.id,
            user_pseudo: user?.pseudo || 'Guest Visitor',
            content: newComment,
            parent_id: replyTo
        }]);
        if (!error) { setNewComment(''); setReplyId(null); fetchComments(); }
    };

    const deleteComment = async (id: string) => {
        if (window.confirm("Delete this comment?")) {
            await supabase.from('comments').delete().eq('id', id);
            fetchComments();
        }
    };

    return (
        <div style={{ marginTop: '50px', borderTop: '2px solid #3E2723', paddingTop: '30px', textAlign: 'left' }}>
            <h3 style={{ fontFamily: 'serif' }}>REVIEWS & COMMENTS ({comments.length})</h3>

            {/* ✍️ POST BOX */}
            {commentsEnabled ? (
                <div style={{ marginBottom: '30px', background: '#f9f9f9', padding: '20px', border: '1px solid #ddd' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{replyTo ? `Replying to comment...` : 'Leave a review:'}</p>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{ width: '100%', height: '80px', marginBottom: '10px', padding: '10px' }}
                        placeholder="Write your thoughts..."
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={postComment} style={btnStyle}>POST COMMENT</button>
                        {replyTo && <button onClick={() => setReplyId(null)} style={{ background: '#ccc', border: 'none', padding: '5px 10px' }}>Cancel Reply</button>}
                    </div>
                </div>
            ) : (
                <p style={{ fontStyle: 'italic', color: '#666' }}>🔒 Commenting has been restricted for this work.</p>
            )}

            {/* 💬 LIST */}
            {comments.map(c => (
                <div key={c.id} style={{
                    marginBottom: '15px',
                    padding: '15px',
                    background: 'white',
                    border: '1px solid #eee',
                    marginLeft: c.parent_id ? '40px' : '0',
                    boxShadow: '2px 2px 0px #eee'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{c.user_pseudo}</strong>
                        <small>{new Date(c.created_at).toLocaleDateString()}</small>
                    </div>
                    <p style={{ margin: '10px 0' }}>{c.content}</p>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        {commentsEnabled && <button onClick={() => setReplyId(c.id)} style={smallBtn}>Reply</button>}
                        {user?.isAdmin && <button onClick={() => deleteComment(c.id)} style={{ ...smallBtn, color: 'red' }}>Delete</button>}
                    </div>
                </div>
            ))}
        </div>
    );
}

const btnStyle = { background: '#3E2723', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' };
const smallBtn = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline', color: '#3E2723', padding: 0 };
