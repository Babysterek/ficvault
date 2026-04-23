import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = () => {
        if (loading) return; // 🔒 prevent double clicks

        setError("");

        if (!otp.trim()) {
            setError("Enter passphrase");
            return;
        }

        setLoading(true);

        // 🔥 simulate small delay for UX
        setTimeout(() => {
            if (otp.trim().toLowerCase() === "halefire") {
                localStorage.setItem("role", "user");

                const profile = localStorage.getItem("profile_id");

                if (profile) {
                    navigate("/home", { replace: true });
                } else {
                    navigate("/create-profile", { replace: true });
                }
            } else {
                setError("Invalid passphrase");
                setLoading(false);
            }
        }, 400);
    };

    return (
        <div className="center-page">
            <div className="card">

                <h1>WELCOME BACK</h1>
                <p>Enter your one-time passphrase</p>

                <input
                    type="password"
                    placeholder="Enter passphrase"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    autoFocus

                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleLogin();
                    }}
                />

                <button onClick={handleLogin} disabled={loading}>
                    {loading ? "Entering..." : "ENTER VAULT"}
                </button>

                {error && <p className="error">{error}</p>}

            </div>
        </div>
    );
}