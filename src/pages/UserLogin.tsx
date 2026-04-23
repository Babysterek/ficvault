import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";

export default function UserLogin() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setLoading(true);

        // ✅ simulate login (you can replace later with real auth)
        localStorage.setItem("profile_id", "temp-user");

        // 🚫 ensure not admin
        localStorage.removeItem("isAdmin");

        // 👉 go to profile setup
        navigate("/create-profile");
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <h1>Enter FicVault</h1>

                <p>
                    Continue to create your profile and access your private archive.
                </p>

                <button
                    className="primary"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Entering..." : "Continue"}
                </button>

            </div>

        </div>
    );
}