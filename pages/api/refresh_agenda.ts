import axios, { AxiosError } from 'axios';

// Constants
const BASE_URL = 'https://api.intra.42.fr/v2';
const RETRY_CONFIG = {
    maxRetries: 3,
    baseDelayMs: 1000,
    maxDelayMs: 10000,
} as const;

// Types
interface ApiResponse<T> {
    data: T;
    status: number;
}

interface CookieObject {
    [key: string]: string;
}

// Utility Functions
const parseCookies = (cookieString: string): CookieObject =>
    Object.fromEntries(cookieString.split('; ').map(c => c.split('=')));

const getBackoffDelay = (attempt: number, retryAfter?: string): number => {
    if (retryAfter) return Math.min(parseInt(retryAfter) * 1000, RETRY_CONFIG.maxDelayMs);
    const exponential = RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt);
    return Math.min(exponential + Math.random() * 100, RETRY_CONFIG.maxDelayMs);
};

export const createApiClient = (token: string) => {
    const instance = axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
        },
        timeout: 5000,
    });

    instance.interceptors.response.use(
        response => response,
        async (error) => {
            const config = error.config;
            if (!config || error.response?.status !== 429 || config._retryCount >= RETRY_CONFIG.maxRetries) {
                return Promise.reject(error);
            }

            config._retryCount = (config._retryCount || 0) + 1;
            const delayMs = getBackoffDelay(config._retryCount, error.response?.headers['retry-after']);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            return instance(config);
        }
    );

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

        // API endpoints and their transformations
        const requests = {
            evaluations: () => api.get('/me/scale_teams'),
            events: () => api.get(`/users/${id}/events`, { params: { sort: '-begin_at', 'page[size]': '100' } }),
            slots: () => api.get('/me/slots', { params: { 'page[size]': '100' } }),
            defancesHistory: () => api.get(`/users/${id}/scale_teams/as_corrected`), 
            campusEvents: () => api.get('/campus/' + campusId + '/events', { params: { sort: '-created_at', 'page[size]': '100' } }),
            locations: () => api.get(`users/${id}/locations`, { params: { 'page[size]': '100' } }),
        };

        // Execute all requests concurrently
        const results = await Promise.all(
            Object.entries(requests).map(async ([key, request]) => {
                const response = await request();
                return [key, response.data];
            })
        );

        // Transform results into response object
        const responseData = Object.fromEntries([
            ...results,
            ['cookies', cookies]
        ]);

        return res.status(200).json(responseData);

    } catch (error) {
        const err = error as Error | AxiosError;
        const status = err instanceof AxiosError ? (err.response?.status || 500) : 500;
        const message = err instanceof AxiosError ? (err.response?.data?.message || err.message) : 'Internal server error';

        console.error('API Error:', { message, status, stack: err.stack });
        return res.status(status).json({ error: message });
    }
}