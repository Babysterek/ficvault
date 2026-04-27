import { Link } from 'react-router-dom';
import './PreHome.css'; // Make sure the CSS file name matches!

export default function PreHome() {
    return (
        <div className="prehome">
            <div className="bg-overlay"></div>

            <div className="content">
                <p className="subtitle">PRIVATE ARCHIVE COLLECTION</p>
                <h1 className="title">THE VAULT</h1>

                <div className="key">🔑</div>

                <p className="desc">
                    A curated collection of fictions and digital archives.
                    Invitation code required for entry.
                </p>

                <Link to="/entry">
                    <button className="btn primary">ENTER COLLECTION</button>
                </Link>

                <div className="footer">
                    EST. 2024 • MEMBERS ONLY
                </div>
            </div>
        </div>
    );
}
