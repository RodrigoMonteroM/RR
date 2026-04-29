import api from "@/services/api";

export const userService = {
    searchUsers: async (query: string) => {
        if (!query.trim()) {
            return [];
        }
        const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
        return response.data.data;
    },
};