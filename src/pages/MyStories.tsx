import React from 'react';
import { Link } from 'react-router-dom';
export default function MyStories({ user }: any) {
    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: 'auto' }}>
            <Link to="/" style={{ color: '#3E2723' }}>← Back to Archive</Link>
            <h1>{user.pseudo}'s Vault</h1>
            <p style={{ fontStyle: 'italic' }}>Your bookmarked stories and subscriptions appear here.</p>
        </div>
    );
}
