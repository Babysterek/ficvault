import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function CreateProfile() {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!name.trim()) return;

        setLoading(true);

        const { data, error } = await supabase
            .from("profiles")
            .insert([{ name }])
            .select()
            .single();

        if (!error && data) {
            localStorage.setItem("profile_id", data.id);
            navigate("/home");
        }

        setLoading(false);
    };

    return (
        <div>
            <h1>Create Profile</h1>

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
            />

            <button onClick={handleCreate}>
                {loading ? "Creating..." : "Create"}
            </button>
        </div>
    );
}