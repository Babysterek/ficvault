import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateProfile.css";

export default function CreateProfile() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");

    /* ================= REGISTER ================= */

    const handleCreate = () => {
        setError("");

        if (!username.trim()) {
            setError("Username required");
            return;
        }

        if (!password.trim()) {
            setError("Password required");
            return;
        }

        if (password.length < 4) {
            setError("Password must be at least 4 characters");
            return;
        }

        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        // 🔐 SAVE USER (localStorage for now)
        localStorage.setItem("profile_id", username);
        localStorage.setItem("user_password", password);

        navigate("/home");
    };

    /* ================= ANONYMOUS ================= */

    const handleAnon = () => {
        localStorage.setItem("profile_id", "anon_user");
        navigate("/home");
    };

    return (
        <div className="profile-page">

            <div className="profile-header">✦ FicVault</div>

            <h1>Create Your Profile</h1>
            <p className="subtext">
                Choose how you would like to continue on FicVault.
            </p>

            <div className="profile-grid">

                {/* REGISTERED */}
                <div className="card">

                    <div className="icon">👤</div>
                    <h2>Registered Account</h2>
                    <p>Create a username and password to save your data.</p>

                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />

                    <button onClick={handleCreate}>
                        CREATE ACCOUNT
                    </button>

                    {error && <p className="error">{error}</p>}

                </div>

                {/* ANONYMOUS */}
                <div className="card">

                    <div className="icon">🎭</div>
                    <h2>Anonymous</h2>
                    <p>Continue without saving your activity.</p>

                    <button onClick={handleAnon}>
                        CONTINUE ANONYMOUSLY
                    </button>

                </div>

            </div>

        </div>
    );
}