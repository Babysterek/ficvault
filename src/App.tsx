import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import type { ReactNode } from "react";

/* ================= PAGES ================= */

// ENTRY FLOW
import PreHome from "./pages/PreHome";
import UserLogin from "./pages/UserLogin";
import AdminPortal from "./pages/AdminPortal";
import AdminLogin from "./pages/AdminLogin";

// MAIN APP
import CreateProfile from "./pages/CreateProfile";
import Home from "./pages/Home";
import NewStory from "./pages/NewStory";
import Reader from "./pages/Reader";
import Bookmarks from "./pages/Bookmarks";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= STATE ================= */
  const role = localStorage.getItem("role");
  const profileId = localStorage.getItem("profile_id");

  /* ================= ROUTE GUARDS ================= */

  const RequireRole = ({ children }: { children: ReactNode }) => {
    if (!role) return <Navigate to="/" replace />;
    return <>{children}</>;
  };

  const RequireProfile = ({ children }: { children: ReactNode }) => {
    if (!profileId) return <Navigate to="/create-profile" replace />;
    return <>{children}</>;
  };

  /* ================= NAVBAR CONTROL ================= */

  const hideNavbarRoutes = ["/", "/login", "/admin", "/admin-login"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className={hideNavbar ? "" : "app-wrapper"}>

      {/* ================= NAVBAR ================= */}
      {!hideNavbar && role && (
        <div className="navbar">

          <div className="logo" onClick={() => navigate("/home")}>
            ✦ FicVault
          </div>

          <div style={{ display: "flex", gap: 10 }}>

            <button onClick={() => navigate("/home")}>
              Home
            </button>

            {role === "admin" && (
              <button onClick={() => navigate("/new")}>
                New Story
              </button>
            )}

            <button onClick={() => navigate("/bookmarks")}>
              Bookmarks
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              Logout
            </button>

          </div>
        </div>
      )}

      {/* ================= ROUTES ================= */}
      <Routes>

        {/* ===== ENTRY FLOW ===== */}
        <Route path="/" element={<PreHome />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ===== PROFILE ===== */}
        <Route
          path="/create-profile"
          element={
            <RequireRole>
              <CreateProfile />
            </RequireRole>
          }
        />

        {/* ===== HOME ===== */}
        <Route
          path="/home"
          element={
            <RequireRole>
              <RequireProfile>
                <Home />
              </RequireProfile>
            </RequireRole>
          }
        />

        {/* ===== NEW STORY (ADMIN ONLY) ===== */}
        <Route
          path="/new"
          element={
            role === "admin" ? (
              <NewStory />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        {/* ===== READER ===== */}
        <Route
          path="/story/:id"
          element={
            <RequireRole>
              <RequireProfile>
                <Reader />
              </RequireProfile>
            </RequireRole>
          }
        />

        {/* ===== BOOKMARKS ===== */}
        <Route
          path="/bookmarks"
          element={
            <RequireRole>
              <RequireProfile>
                <Bookmarks />
              </RequireProfile>
            </RequireRole>
          }
        />

        {/* ✅ FALLBACK (VERY IMPORTANT) */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

    </div>
  );
}