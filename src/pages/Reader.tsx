import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Reader({ user }: any) {
    const [comments, setComments] = useState([
        { id: 1, author: 'Anonymous', text: 'This was a beautiful read!' }
    ]);

    return (
        <div style={{ background: 'white', minHeight: '100vh', padding: '40px' }}>
            <div style={{ maxWidth: '800px', margin: 'auto' }}>
                <Link to="/" style={{ color: 'var(--dark-brown)', fontSize: '0.8rem' }}>← BACK TO ARCHIVE</Link>

                {/* AO3 Metadata Block */}
                <div style={{ border: '1px solid var(--dark-brown)', padding: '20px', background: 'var(--peach-coral)', margin: '40px 0' }}>
                    <dl style={{ display: 'grid', gridTemplateColumns: '150px 1fr', margin: 0 }}>
                        <dt><strong>Rating:</strong></dt><dd>General Audiences</dd>
                        <dt><strong>Category:</strong></dt><dd>Gen</dd>
                        <dt><strong>Fandom:</strong></dt><dd>Original Work</dd>
                    </dl>
                </div>

                <article style={{ fontSize: '1.2rem', lineHeight: '1.8', fontFamily: 'serif' }}>
                    <h2>Work Title</h2>
                    <p>The literary content of the vault appears here, distraction-free and elegant...</p>
                </article>

                {/* Comment Section */}
                <section style={{ marginTop: '80px', borderTop: '2px solid var(--dark-brown)', paddingTop: '20px' }}>
                    <h3>Comments</h3>
                    {comments.map(c => (
                        <div key={c.id} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                            <strong>{c.author}</strong>: {c.text}
                            {user.isAdmin && (
                                <button onClick={() => setComments([])} style={{ background: 'none', color: 'red', border: 'none', padding: 0, marginLeft: '15px', cursor: 'pointer', fontSize: '0.7rem' }}>
                                    [DELETE COMMENT]
                                </button>
                            )}
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}
