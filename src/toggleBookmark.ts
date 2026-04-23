import { addBookmark, removeBookmark, getBookmarks } from "./api";

type ToggleParams = {
    userId: string;
    storyId: string;
};

/**
 * Toggles bookmark state for FicVault
 * returns: true = now bookmarked, false = removed
 */
export const toggleBookmark = async ({
    userId,
    storyId,
}: ToggleParams): Promise<boolean> => {
    // Safety check: Don't run if user isn't logged in
    if (!userId || !storyId) {
        console.error("Missing User ID or Story ID for bookmarking");
        return false;
    }

    try {
        // 1️⃣ Fetch current bookmarks to check state
        const bookmarks = await getBookmarks(userId);

        // Check if this specific story ID is already in the list
        const exists = bookmarks?.some(
            (b: any) => b.story_id === storyId || b.id === storyId
        );

        // 2️⃣ Perform the Toggle
        if (exists) {
            await removeBookmark(userId, storyId);
            console.log(`Bookmark removed for story: ${storyId}`);
            return false;
        } else {
            await addBookmark(userId, storyId);
            console.log(`Bookmark added for story: ${storyId}`);
            return true;
        }
    } catch (err) {
        console.error("FicVault Toggle failed:", err);
        // We throw the error so the UI (Home.tsx) can show an alert if needed
        throw err;
    }
};
