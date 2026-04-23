const handleCreate = async () => {
    if (!name.trim()) {
        alert("Enter a name");
        return;
    }

    try {
        setLoading(true);

        const { data, error } = await supabase
            .from("profiles")
            .insert([{ name }])
            .select()
            .single();

        if (error) {
            console.error(error);
            alert("Failed to create profile");
            return;
        }

        // ✅ SAVE PROFILE ID
        localStorage.setItem("profile_id", data.id);

        // 👉 GO HOME
        navigate("/home");

    } catch (err) {
        console.error(err);
        alert("Something went wrong");
    } finally {
        setLoading(false);
    }
};