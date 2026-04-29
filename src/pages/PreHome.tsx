import { Link } from 'react-router-dom';

export default function PreHome() {
    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', color: '#3E2723', fontFamily: 'serif', margin: 0 }}>FICVAULT</h1>
            <p style={{ fontSize: '1.2rem', color: '#3E2723', letterSpacing: '2px', marginBottom: '40px' }}>SECURE ARCHIVE & PRIVATE COLLECTION</p>
            <Link to="/entry" style={{ background: '#3E2723', color: 'white', padding: '15px 50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '5px 5px 0px white' }}>
                ACCESS RECORDS
            </Link>
        </div>
    );
}
