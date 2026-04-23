import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import "./Layout.css";

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="layout-container">

            {/* ===== SIDEBAR ===== */}
            <aside className="sidebar">
                <h2 onClick={() => navigate("/home")}>FicVault</h2>

                <button
                    className={isActive("/home") ? "active" : ""}
                    onClick={() => navigate("/home")}
                >
                    Home
                </button>

                <button
                    className={isActive("/bookmarks") ? "active" : ""}
                    onClick={() => navigate("/bookmarks")}
                >
                    Bookmarks
                </button>

                <button
                    className={isActive("/my-stories") ? "active" : ""}
                    onClick={() => navigate("/my-stories")}
                >
                    My Stories
                </button>

                {/* 👑 ADMIN ONLY */}
                {isAdmin && (
                    <button
                        className={isActive("/new") ? "active" : ""}
                        onClick={() => navigate("/new")}
                    >
                        + New Story
                    </button>
                )}
            </aside>

            {/* ===== RIGHT SIDE ===== */}
            <div className="layout-content">

                {/* TOP BAR */}
                <Navbar />

                {/* MAIN CONTENT (AO3 CENTERED CARD WRAPPER) */}
                <main className="layout-main">
                    <div className="page-container">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}