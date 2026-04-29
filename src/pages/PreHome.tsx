import { Link } from 'react-router-dom';

export default function PreHome() {
    return (
        <div style={{
            background: '#F2B29A',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px'
        }}>
            {/* 🏛️ THE VAULT BRANDING */}
            <div style={{
                border: '4px solid #3E2723',
                padding: '40px 60px',
                background: 'white',
                boxShadow: '15px 15px 0px #3E2723',
                maxWidth: '600px'
            }}>
                <h1 style={{
                    fontSize: '4.5rem',
                    color: '#3E2723',
                    fontFamily: 'serif',
                    margin: 0,
                    lineHeight: '1'
                }}>
                    FICVAULT
                </h1>

                <div style={{
                    height: '2px',
                    background: '#3E2723',
                    width: '100%',
                    margin: '20px 0'
                }}></div>

                <p style={{
                    fontSize: '1.2rem',
                    color: '#3E2723',
                    letterSpacing: '4px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    margin: '0 0 40px 0'
                }}>
                    Secure Private Archive
                </p>

                {/* 🔑 ACCESS BUTTON - LINKS TO GATEKEEPER */}
                <Link
                    to="/entry"
                    style={{
                        display: 'inline-block',
                        background: '#3E2723',
                        color: 'white',
                        padding: '15px 50px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        border: '2px solid #3E2723',
                        transition: '0.3s'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.color = '#3E2723';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = '#3E2723';
                        e.currentTarget.style.color = 'white';
                    }}
                >
                    ACCESS RECORDS
                </Link>
            </div>

            <footer style={{
                position: 'absolute',
                bottom: '30px',
                fontSize: '0.8rem',
                color: '#3E2723',
                letterSpacing: '1px'
            }}>
                EST. 2024 — OPERATED BY BABYSTEREK
            </footer>
        </div>
    );
}
