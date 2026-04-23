import { supabase } from "./supabase";

/* ================= STORIES ================= */

// GET ALL STORIES
export const getStories = async () => {
    const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};

// GET SINGLE STORY
export const getStoryById = async (id: string) => {
    const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
};

// CREATE STORY (ADMIN)
export const createStory = async (story: any) => {
    const { data, error } = await supabase
        .from("stories")
        .insert([story])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// DELETE STORY (ADMIN)
export const deleteStory = async (id: string) => {
    const { error } = await supabase
        .from("stories")
        .delete()
        .eq("id", id);

    if (error) throw error;
};

/* ================= CHAPTERS ================= */

// GET CHAPTERS BY STORY
export const getChapters = async (storyId: string) => {
    const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("story_id", storyId)
        .order("chapter_number", { ascending: true });

    if (error) throw error;
    return data;
};

// CREATE CHAPTER
export const createChapter = async (chapter: any) => {
    const { data, error } = await supabase
        .from("chapters")
        .insert([chapter])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// DELETE CHAPTER
export const deleteChapter = async (id: string) => {
    const { error } = await supabase
        .from("chapters")
        .delete()
        .eq("id", id);

    if (error) throw error;
};

/* ================= BOOKMARKS ================= */

// GET USER BOOKMARKS
export const getBookmarks = async (userId: string) => {
    const { data, error } = await supabase
        .from("bookmarks")
        .select(`
      id,
      story_id,
      stories (
        id,
        title,
        description
      )
    `)
        .eq("user_id", userId);

    if (error) throw error;
    return data;
};

// ADD BOOKMARK
export const addBookmark = async (userId: string, storyId: string) => {
    const { error } = await supabase
        .from("bookmarks")
        .insert([{ user_id: userId, story_id: storyId }]);

    if (error) throw error;
};

// REMOVE BOOKMARK
export const removeBookmark = async (userId: string, storyId: string) => {
    const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("story_id", storyId);

    if (error) throw error;
};