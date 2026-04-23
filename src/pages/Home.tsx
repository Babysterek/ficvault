import React from 'react';
import { Link } from 'react-router-dom';

export default function Home({ user }: any) {
    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #3E2723', paddingBottom: '10px' }}>
                <h2 style={{ color: '#900', margin: 0 }}>FICVAULT</h2>
                <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link to="/" style={{ color: '#3E2723', textDecoration: 'none' }}>Archive</Link>
                    {user.isAdmin && <Link to="/admin-portal" style={{ fontWeight: 'bold', color: 'red' }}>Admin Portal</Link>}
                    {user.isAdmin && <Link to="/post-work" style={{ fontWeight: 'bold', color: '#3E2723' }}>Post New</Link>}
                    <span>{user.pseudo}</span>
                </nav>
            </header>

            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1>Welcome to the Archive</h1>
                <p>Browse stories or check your bookmarks.</p>
            </div>
        </div>
    );
}
