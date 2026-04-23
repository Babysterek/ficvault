import { useNavigate } from "react-router-dom";
import "./PreHome.css";

export default function PreHome() {
    const navigate = useNavigate();

    return (
        <div className="prehome">

            {/* 🔥 BACKGROUND LAYER (important for design) */}
            <div className="bg-overlay" />

            <div className="content">

                <h1 className="title">FICVAULT</h1>

                <p className="subtitle">
                    TALES & DRABBLES, KEPT SAFE.
                </p>

                <div className="key">🔑</div>

                <p className="desc">
                    A curated collection of fanfictions and drabbles —
                    explore, read, and get inspired.
                </p>

                {/* ENTER SITE */}
                <button
                    className="btn primary"
                    onClick={() => navigate("/login")}
                >
                    ENTER SITE
                </button>

                {/* LOGIN */}
                <button
                    className="btn secondary"
                    onClick={() => navigate("/login")}
                >
                    LOGIN
                </button>

                {/* ADMIN */}
                <button
                    className="admin"
                    onClick={() => navigate("/admin")}
                >
                    ADMIN LOGIN
                </button>

                <div className="footer">
                    ABOUT FICVAULT | THE LATEST FANFICTIONS | THE DRABBLE ARCHIVE
                    <br />
                    © FicVault
                </div>

            </div>
        </div>
    );
}