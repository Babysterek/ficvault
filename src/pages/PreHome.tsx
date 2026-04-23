import { useNavigate } from "react-router-dom";
import "./PreHome.css";

export default function PreHome() {
    const navigate = useNavigate();

    return (
        <div className="prehome">

            {/* BACKGROUND IMAGE */}
            <div className="bg-overlay" />

            {/* CONTENT */}
            <div className="content">

                <h1 className="title">FICVAULT</h1>

                <p className="subtitle">A PRIVATE ARCHIVE</p>

                <p className="key">🔐</p>

                <p className="desc">
                    A quiet place to store stories, read without noise, and keep what matters.
                </p>

                {/* USER LOGIN */}
                <button
                    className="btn primary"
                    onClick={() => navigate("/login")}
                >
                    Enter Vault
                </button>

                {/* PROFILE FLOW */}
                <button
                    className="btn secondary"
                    onClick={() => navigate("/create-profile")}
                >
                    Create Profile
                </button>

                {/* ADMIN */}
                <div className="admin">
                    <button onClick={() => navigate("/admin-login")}>
                        Admin Access
                    </button>
                </div>

                <div className="footer">
                    FicVault • Private Archive System
                </div>

            </div>
        </div>
    );
}