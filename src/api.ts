import { supabase } from "./supabase";

/**
 * Fetches all bookmarks for a specific user
 */
export const getBookmarks = async (userId: string) => {
    const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId);

    if (error) throw error;
    return data;
};

/**
 * Adds a new bookmark entry
 */
export const addBookmark = async (userId: string, storyId: string) => {
    const { data, error } = await supabase
        .from('bookmarks')
        .insert([{ user_id: userId, story_id: storyId }]);

    if (error) throw error;
    return data;
};

/**
 * Removes a bookmark entry
 */
export const removeBookmark = async (userId: string, storyId: string) => {
    const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('story_id', storyId);

    if (error) throw error;
    return true;
};
