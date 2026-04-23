import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const profileId = localStorage.getItem("profile_id");

    /* ===== LOGOUT ===== */
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="navbar">

            {/* LEFT */}
            <div className="nav-left">
                <h2 onClick={() => navigate("/home")}>
                    FicVault
                </h2>
            </div>

            {/* RIGHT */}
            <div className="nav-right">

                {/* USER LABEL */}
                <span className="profile">
                    {isAdmin ? "Admin" : profileId ? "User" : "Guest"}
                </span>

                {/* LOGOUT */}
                <button className="logout" onClick={handleLogout}>
                    Logout
                </button>

            </div>
        </div>
    );
}