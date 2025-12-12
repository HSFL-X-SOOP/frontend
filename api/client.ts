import {LoginResponse} from "@/api/models/auth";
import {useSession} from "@/context/SessionContext";
import axios, {AxiosError, InternalAxiosRequestConfig} from "axios";
import {ENV} from "@/config/environment";
import { createLogger } from "@/utils/logger";

const logger = createLogger('HTTP:Client');

export function useHttpClient() {
    const {session, login, logout} = useSession()

    const httpClient = axios.create({
        baseURL: ENV.apiUrl,
        timeout: 30_000,
    })

    let refreshPromise: Promise<string> | null = null;

    const refreshAccessToken = async (refreshToken: string): Promise<string> => {
        if (refreshPromise) {
            return refreshPromise;
        }

        refreshPromise = (async () => {
            try {
                const {data} = await axios.post<LoginResponse>(
                    `${ENV.apiUrl}/auth/refresh`,
                    {refreshToken}
                )

                const newSession = {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    loggedInSince: session?.loggedInSince ?? new Date(),
                    lastTokenRefresh: new Date(),
                    profile: data.profile,
                    role: data.profile?.authorityRole ?? null
                }

                login(newSession)
                return newSession.accessToken
            } finally {
                // Clear the promise after completion (success or failure)
                refreshPromise = null;
            }
        })();

        return refreshPromise;
    }

    httpClient.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            if (!session) return config

            const expMS = 15 * 60 * 1000
            const toleranceMS = 60 * 1000;
            const now = Date.now()
            const age = now - new Date(session.loggedInSince).getTime()

            const needsRefresh =
                session.refreshToken && age >= (expMS - toleranceMS);

            if (needsRefresh) {
                try {
                    const accessToken = await refreshAccessToken(session.refreshToken!)
                    config.headers.Authorization = `Bearer ${accessToken}`
                } catch (err) {
                    logger.error('Token refresh failed in request interceptor', err);
                    return config
                }
            } else {
                config.headers.Authorization = `Bearer ${session.accessToken}`
            }

            return config
        }
    )

    httpClient.interceptors.response.use(
        (res) => res,
        async (err: AxiosError) => {
            const originalRequest = err.config as InternalAxiosRequestConfig & { _retry?: boolean };

            if (err.response?.status === 401 && originalRequest && !originalRequest._retry) {
                if (session?.refreshToken) {
                    originalRequest._retry = true;

                    try {
                        const accessToken = await refreshAccessToken(session.refreshToken);
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return httpClient(originalRequest);
                    } catch (refreshError) {
                        logger.error('Token refresh failed', refreshError);
                        logout();
                        return Promise.reject(refreshError);
                    }
                } else {
                    logger.warn('No refresh token available, logging out');
                    logout();
                }
            }
            return Promise.reject(err);
        }
    )

    return httpClient
}
