import { Link } from 'react-router-dom';

export default function Terms() {
    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{
                maxWidth: '700px',
                margin: 'auto',
                background: 'white',
                padding: '50px',
                border: '2px solid #3E2723',
                boxShadow: '15px 15px 0px #3E2723',
                textAlign: 'left',
                lineHeight: '1.6'
            }}>
                <h1 style={{ fontFamily: 'serif', borderBottom: '3px solid #3E2723', paddingBottom: '10px', color: '#3E2723' }}>
                    VAULT PROTOCOLS
                </h1>

                <section style={sectionStyle}>
                    <h3>✦ SITE NOTES</h3>
                    <p>This is a private archive. I am the only authorized contributor. You are welcome to access records, read, and leave commentary.</p>
                </section>

                <section style={sectionStyle}>
                    <h3>✦ COMMENTS & INTERACTION</h3>
                    <ul>
                        <li>Keep interaction focused on the work—reactions, thoughts, and OTP discussion are encouraged.</li>
                        <li>Maintain respect; do not initiate or engage in arguments.</li>
                        <li>No call-outs, speculation, or attempts to de-anonymize or investigate authorship.</li>
                        <li>If you find content disagreeable, please exit the record rather than initiating a thread.</li>
                    </ul>
                </section>

                <section style={sectionStyle}>
                    <h3>✦ SHARING & DISTRIBUTION</h3>
                    <p>Access may be shared with individuals who have a genuine interest in reading. Do not distribute links for the purpose of drama, discourse, or external scrutiny.</p>
                </section>

                <section style={sectionStyle}>
                    <h3>✦ BOUNDARIES</h3>
                    <p>Strictly no reposting or capturing screenshots without explicit permission. This space is to remain insulated from outside conflicts.</p>
                </section>

                <section style={sectionStyle}>
                    <h3>✦ ON AUTHORSHIP</h3>
                    <p>Process and methodology are not up for discussion. Accusations or commentary regarding how work is produced will be removed.</p>
                </section>

                <section style={{ ...sectionStyle, borderBottom: 'none' }}>
                    <h3>✦ FINAL MANDATE</h3>
                    <p><strong>Be normal about it.</strong> Read, comment if you wish, and keep the environment tranquil.</p>
                </section>

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <Link to="/entry" style={btnStyle}>I UNDERSTAND & AGREE</Link>
                </div>
            </div>
        </div>
    );
}

const sectionStyle = { marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' };
const btnStyle = { background: '#3E2723', color: 'white', padding: '12px 30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' };
