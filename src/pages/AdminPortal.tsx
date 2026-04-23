import { useNavigate } from "react-router-dom";

export default function AdminPortal() {
    const navigate = useNavigate();

    return (
        <div className="vault-screen">

            <div className="vault-card">

                <h1>FICVAULT ADMIN PORTAL</h1>
                <p>Control the archive.</p>

                <div className="vault-illustration">
                    📂
                </div>

                <button className="primary" onClick={() => navigate("/admin-login")}>
                    ADMIN LOGIN
                </button>

                <button className="secondary" onClick={() => navigate("/")}>
                    BACK TO SITE
                </button>

            </div>

        </div>
    );
}