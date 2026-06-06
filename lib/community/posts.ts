// Serviço de posts (re-exporta as server actions de mutação).
// Leituras ficam em ./queries (server-only).
export { createPost, deletePost, toggleSave, sharePost } from "./actions";
