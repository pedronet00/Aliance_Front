export const getImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    // Unifica as barras para facilitar
    const unifiedPath = path.replace(/\\/g, "/");

    // Encontra a pasta raiz de uploads
    const uploadsIndex = unifiedPath.indexOf("/uploads/");

    if (uploadsIndex !== -1) {
        const relativePath = unifiedPath.substring(uploadsIndex); // ex: "/uploads/..."
        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, ""); // remove "/api" do final

        return `${baseUrl}${relativePath}`;
    }

    return path;
};
