import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Gatekeeper() {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    /* ================= AUTO REDIRECT ================= */

    useEffect(() => {
        const role = localStorage.getItem("role");
        const profileId = localStorage.getItem("profile_id");

        if (role === "admin") {
            navigate("/home");
        }

        if (role === "user" && profileId) {
            navigate("/home");
        }

        if (role === "user" && !profileId) {
            navigate("/create-profile");
        }
    }, []);

    /* ================= LOGIN ================= */

    const handleLogin = () => {
        setError("");

        const input = password.trim();

        // 🔐 ADMIN
        if (input === "ammuisfine") {
            localStorage.setItem("role", "admin");
            navigate("/home");
            return;
        }

        // 👤 USER (OTP style)
        if (input === "halefire") {
            localStorage.setItem("role", "user");
            navigate("/create-profile");
            return;
        }

        setError("Invalid access key");
    };

    /* ================= ENTER KEY ================= */

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    /* ================= UI ================= */

    return (
        <div className="gatekeeper">
            <div className="card">

                <h1 className="logo-serif">FICVAULT</h1>

                <input
                    type="password"
                    placeholder="Enter Invite Code"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button onClick={handleLogin}>
                    Enter
                </button>

                {error && <p className="error">{error}</p>}

            </div>
        </div>
    );
}