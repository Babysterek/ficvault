import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            <h2 onClick={() => navigate("/home")}>FicVault</h2>

            <button onClick={() => navigate("/home")}>Home</button>
            <button onClick={() => navigate("/bookmarks")}>Bookmarks</button>
        </div>
    );
}