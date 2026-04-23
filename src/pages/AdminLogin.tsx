import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        setError("");

        if (
            username === "babysterek" &&
            password === "ammuisfine"
        ) {
            localStorage.setItem("role", "admin");
            navigate("/home");
            return;
        }

        setError("Invalid admin credentials");
    };

    return (
        <div className="center-page">
            <div className="card">
                <h1>ADMIN ACCESS</h1>

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

                <button onClick={handleLogin}>
                    ENTER DASHBOARD
                </button>

                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}