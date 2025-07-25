import axios from 'axios';
import axiosRetry from 'axios-retry';

export const fetchUserWithRetry = async (userId: number, retries: number, token: string, lazyMode: boolean) => {
    const userCache: Map<number, any> = new Map();

    if (lazyMode && userCache.has(userId)) {
        return userCache.get(userId);
    }

    const client = axios.create();
    axiosRetry(client, {
        retries,
        retryDelay: (retryCount) => Math.pow(2, retryCount) * 1000,
        retryCondition: (error) => error.response?.status === 429 || !error.response?.ok,
    });

    try {
        const response = await client.get(`/api/get_user?id=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        userCache.set(userId, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        throw error;
    }
};