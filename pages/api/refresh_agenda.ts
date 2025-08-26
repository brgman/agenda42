import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';

// Constants
const BASE_URL = 'https://api.intra.42.fr/v2';

// Types
interface CookieObject {
    [key: string]: string;
}

type ApiRequest = () => Promise<AxiosResponse>;

// Utility Functions
const parseCookies = (cookieString: string): CookieObject =>
    Object.fromEntries(cookieString.split('; ').map(c => c.split('=')));

// API Client Factory
const createApiClient = (token: string): AxiosInstance => {
    const instance = axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
        timeout: 15000,
    });

    // Configure axios-retry for 429 errors
    axiosRetry(instance, {
        retries: 3,
        retryDelay: (retryCount, error) => {
            const retryAfter = error.response?.headers['retry-after'];
            return retryAfter ? Math.min(parseInt(retryAfter) * 1000, 10000) : axiosRetry.exponentialDelay(retryCount);
        },
        retryCondition: (error: AxiosError) => error.response?.status === 429,
    });

    return instance;
};

// Main Handler
export default async function handler(req: any, res: any) {
    try {
        const { id, campusId } = req.query;
        const cookies = parseCookies(req.headers.cookie || '');
        const token = cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Authentication token required' });
        }

        const api = createApiClient(token);

        // API endpoints
        const requests: Record<string, ApiRequest> = {
            evaluations: () => api.get('/me/scale_teams'),
            events: () => api.get(`/users/${id}/events`, { params: { sort: '-begin_at', 'page[size]': 100 } }),
            slots: () => api.get('/me/slots', { params: { 'page[size]': 100 } }),
            defancesHistory: () => api.get(`/users/${id}/scale_teams/as_corrected`),
            campusEvents: () => api.get(`/campus/${campusId}/events`, { params: { sort: '-created_at', 'page[size]': 100 } }),
            locations: () => api.get(`/users/${id}/locations`, { params: { 'page[size]': 100 } }),
        };

        // Execute requests concurrently
        const results = await Promise.all(
            Object.entries(requests).map(async ([key, request]) => [key, (await request()).data])
        );

        // Build response
        const responseData = Object.fromEntries([...results, ['cookies', cookies]]);

        return res.status(200).json(responseData);
    } catch (error) {
        const err = error as Error | AxiosError;
        const status = err instanceof AxiosError ? err.response?.status || 500 : 500;
        const message = err instanceof AxiosError ? err.response?.data?.message || err.message : 'Internal server error';

        console.error('API Error:', { message, status, stack: err.stack });
        return res.status(status).json({ error: message });
    }
}