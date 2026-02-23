import {LoginResponse} from "@/api/models/auth";
import {SessionInfo, useSession} from "@/context/SessionContext";
import axios, {AxiosError, InternalAxiosRequestConfig} from "axios";
import {ENV} from "@/config/environment";
import {createLogger} from "@/utils/logger";

const logger = createLogger('HTTP:Client');
const expMS = 15 * 60 * 1000;
const toleranceMS = 60 * 1000;

const httpClient = axios.create({
    baseURL: ENV.apiUrl,
    timeout: 30_000,
});

let refreshPromise: Promise<string> | null = null;
let interceptorsAttached = false;
let currentSession: SessionInfo | undefined;
let currentLogin: ((session: SessionInfo) => void) | undefined;
let currentLogout: (() => void) | undefined;

function toEpochMs(value: Date | string | null | undefined): number | null {
    if (!value) return null;
    const epochMs = new Date(value).getTime();
    return Number.isNaN(epochMs) ? null : epochMs;
}

const refreshAccessToken = async (refreshToken: string): Promise<string> => {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        const sessionSnapshot = currentSession;
        const {data} = await axios.post<LoginResponse>(
            `${ENV.apiUrl}/auth/refresh`,
            {refreshToken}
        );

        const refreshedAt = new Date();
        const newSession: SessionInfo = {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            loggedInSince: sessionSnapshot?.loggedInSince ?? refreshedAt,
            lastTokenRefresh: refreshedAt,
            profile: data.profile,
            role: data.profile?.authorityRole ?? null
        };

        currentSession = newSession;
        currentLogin?.(newSession);
        return newSession.accessToken;
    })().finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
};

function attachInterceptors() {
    if (interceptorsAttached) {
        return;
    }
    interceptorsAttached = true;

    httpClient.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            const session = currentSession;
            if (!session) {
                return config;
            }

            const now = Date.now();
            const lastRefreshAt =
                toEpochMs(session.lastTokenRefresh as Date | string | null | undefined)
                ?? toEpochMs(session.loggedInSince as Date | string | undefined)
                ?? now;
            const age = now - lastRefreshAt;
            const needsRefresh = Boolean(session.refreshToken) && age >= (expMS - toleranceMS);

            if (needsRefresh) {
                try {
                    const accessToken = await refreshAccessToken(session.refreshToken!);
                    config.headers.Authorization = `Bearer ${accessToken}`;
                } catch (err) {
                    logger.error('Token refresh failed in request interceptor', err);
                    config.headers.Authorization = `Bearer ${session.accessToken}`;
                }
            } else {
                config.headers.Authorization = `Bearer ${session.accessToken}`;
            }

            return config;
        }
    );

    httpClient.interceptors.response.use(
        (res) => res,
        async (err: AxiosError) => {
            const originalRequest = err.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

            if (err.response?.status === 401 && originalRequest && !originalRequest._retry) {
                const session = currentSession;
                if (session?.refreshToken) {
                    originalRequest._retry = true;

                    try {
                        const accessToken = await refreshAccessToken(session.refreshToken);
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return httpClient(originalRequest);
                    } catch (refreshError) {
                        logger.error('Token refresh failed', refreshError);
                        currentLogout?.();
                        return Promise.reject(refreshError);
                    }
                }

                logger.warn('No refresh token available, logging out');
                currentLogout?.();
            }

            return Promise.reject(err);
        }
    );
}

export function useHttpClient() {
    const {session, login, logout} = useSession();

    currentSession = session;
    currentLogin = login;
    currentLogout = logout;
    attachInterceptors();

    return httpClient;
}