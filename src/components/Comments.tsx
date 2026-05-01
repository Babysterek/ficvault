import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function CommentSection({ storyId, user }: any) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');

    // 1. Fetch comments when the page loads
    useEffect(() => {
        fetchComments();
    }, [storyId]);

    const fetchComments = async () => {
        const { data } = await supabase
            .from('comments')
            .select('*')
            .eq('story_id', storyId)
            .order('created_at', { ascending: true });
        if (data) setComments(data);
    };

    // 2. Post a new comment
    const handlePost = async () => {
        if (!newComment.trim()) return;

        const { error } = await supabase
            .from('comments')
            .insert([{
                story_id: storyId,
                content: newComment,
                author: user.pseudo
            }]);

        if (error) {
            alert("Error: " + error.message);
        } else {
            setNewComment('');
            fetchComments(); // Refresh the list
        }
    };

    return (
        <div style={{ marginTop: '50px', borderTop: '1px solid #3E2723', paddingTop: '20px' }}>
            <h3>COMMENTS ({comments.length})</h3>

            <div style={{ marginBottom: '20px' }}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Leave a comment..."
                    style={{ width: '100%', height: '80px', padding: '10px' }}
                />
                <button
                    onClick={handlePost}
                    style={{ marginTop: '10px', background: '#3E2723', color: 'white', padding: '10px 20px', cursor: 'pointer' }}
                >
                    POST COMMENT
                </button>
            </div>

            {comments.map((c) => (
                <div key={c.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                    <strong>{c.author}</strong>
                    <p>{c.content}</p>
                </div>
            ))}
        </div>
    );
}
