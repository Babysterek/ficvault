import { supabase } from "../supabase";

export async function toggleBookmark({
    userId,
    storyId,
}: {
    userId: string;
    storyId: string;
}) {
    // check if already bookmarked
    const { data: existing } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .eq("story_id", storyId)
        .single();

    // ❌ REMOVE
    if (existing) {
        await supabase
            .from("bookmarks")
            .delete()
            .eq("user_id", userId)
            .eq("story_id", storyId);

        return false;
    }

    // ✅ ADD
    await supabase
        .from("bookmarks")
        .insert([
            {
                user_id: userId,
                story_id: storyId,
            },
        ]);

    return true;
}