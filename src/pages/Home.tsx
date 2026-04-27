import { Link } from 'react-router-dom';
import './Home.css'; // Make sure the file is named Home.css

export default function Home({ user }: any) {
    return (
        <div className="home" style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
            <header className="home-header">
                <h1>FICVAULT ARCHIVE</h1>
                <p>Welcome back, {user.pseudo}. You are viewing the restricted collection.</p>

                <nav style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    {user.isAdmin && <Link to="/admin-portal" style={{ color: 'red', fontWeight: 'bold' }}>Admin Center</Link>}
                    {user.isAdmin && <Link to="/post-work" style={{ color: '#3E2723', fontWeight: 'bold' }}>Post New</Link>}
                    <Link to="/my-stories">My Vault</Link>
                </nav>
            </header>

            <div className="home-filters">
                <button className="active">All Stories</button>
                <button>Recent</button>
                <button>Bookmarked</button>
            </div>

            <div className="story-list">
                {/* When you have stories, they will go here! */}
                <div className="empty">
                    <p>The archive is currently empty. Check back soon for new arrivals.</p>
                </div>
            </div>
        </div>
    );
}
