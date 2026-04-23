import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    requireAdmin?: boolean;
    requireProfile?: boolean;
};

export default function Gatekeeper({
    children,
    requireAdmin = false,
    requireProfile = false,
}: Props) {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const profileId = localStorage.getItem("profile_id");

    /* ===== NOT LOGGED IN ===== */
    if (!isAdmin && !profileId) {
        return <Navigate to="/" replace />;
    }

    /* ===== ADMIN ONLY ===== */
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/home" replace />;
    }

    /* ===== USER PROFILE REQUIRED ===== */
    if (requireProfile && !profileId && !isAdmin) {
        return <Navigate to="/create-profile" replace />;
    }

    return <>{children}</>;
}