import { addBookmark, removeBookmark, getBookmarks } from "./api";

type ToggleParams = {
    userId: string;
    storyId: string;
};

/**
 * Toggles bookmark state
 * returns: true = now bookmarked, false = removed
 */
export const toggleBookmark = async ({
    userId,
    storyId,
}: ToggleParams): Promise<boolean> => {
    try {
        // 1️⃣ check existing bookmarks
        const bookmarks = await getBookmarks(userId);

        const exists = bookmarks?.some(
            (b: any) => b.story_id === storyId
        );

        // 2️⃣ toggle
        if (exists) {
            await removeBookmark(userId, storyId);
            return false;
        } else {
            await addBookmark(userId, storyId);
            return true;
        }
    } catch (err) {
        console.error("Toggle bookmark failed:", err);
        throw err;
    }
};