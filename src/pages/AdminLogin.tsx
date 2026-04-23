import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        if (password === "ammu") {
            // ✅ SET ADMIN
            localStorage.setItem("isAdmin", "true");

            // 🚫 REMOVE USER SESSION
            localStorage.removeItem("profile_id");

            // 👉 GO TO HOME
            navigate("/home");
        } else {
            alert("Wrong password");
        }
    };

    return (
        <div className="login-page">

            <h2>Admin Login</h2>

            <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
            />

            <button onClick={handleLogin} className="primary">
                Login as Admin
            </button>

        </div>
    );
}