import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import pLimit from 'p-limit';

const BASE_URL = 'https://api.intra.42.fr/v2';
const RETRY_CONFIG = {
    maxRetries: 5,
    baseDelayMs: 2000,
    maxDelayMs: 10000,
} as const;

interface CookieObject {
    [key: string]: string;
}

const parseCookies = (cookieString: string): CookieObject =>
    Object.fromEntries(cookieString.split('; ').map(c => c.split('=')));

const getBackoffDelay = (attempt: number, retryAfter?: string): number => {
    if (retryAfter) return Math.min(parseInt(retryAfter) * 1000, RETRY_CONFIG.maxDelayMs);
    const exponential = RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt);
    return Math.min(exponential + Math.random() * 100, RETRY_CONFIG.maxDelayMs);
};

const validateToken = async (token: string) => {
    try {
        await axios.get(`${BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return true;
    } catch {
        return false;
    }
};

const createApiClient = (token: string) => {
    const instance = axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
        },
        timeout: 15000,
    });

    instance.interceptors.response.use(
        response => response,
        async (error) => {
            const config = error.config;
            if (!config || ![429, 500].includes(error.response?.status) || config._retryCount >= RETRY_CONFIG.maxRetries) {
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const cookies = parseCookies(req.headers.cookie || '');
        const token = cookies.token;

        if (!token || !(await validateToken(token))) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const api = createApiClient(token);
        const limit = pLimit(2);

        const requests = {
            // correction_point_historics: () => api.get(`users/${id}/correction_point_historics`),
            // expertises_users: () => api.get(`/users/${id}/expertises_users`),
            coalitions: () => api.get(`/users/${id}/coalitions`),
            teams: () => api.get(`/users/${id}/teams`),
            user: () => api.get(`/users/${id}`),
            projects_users: () => api.get(`/users/${id}/projects_users`, { params: { sort: '-created_at', 'page[size]': '100' } }),
        };

        const results = await Promise.allSettled(
            Object.entries(requests).map(([key, request]) =>
                limit(async () => {
                    try {
                        const response = await request();
                        return [key, response.data];
                    } catch (error) {
                        return [key, { error: error.message || 'Request failed' }];
                    }
                })
            )
        );

        const responseData = Object.fromEntries(
            results
                .filter((result): result is PromiseFulfilledResult<[string, any]> => result.status === 'fulfilled')
                .map(result => result.value)
                .concat([['cookies', cookies]])
        );

        return res.status(200).json(responseData);

    } catch (error) {
        const err = error as Error | AxiosError;
        const status = err instanceof AxiosError ? (err.response?.status || 500) : 500;
        const message = err instanceof AxiosError ? (err.response?.data?.message || err.message) : 'Internal server error';

        console.error('API Error:', {
            message,
            status,
            stack: err.stack,
            response: err instanceof AxiosError ? err.response?.data : null,
        });
        return res.status(status).json({ error: message });
    }
}