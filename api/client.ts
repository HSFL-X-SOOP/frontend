import {LoginResponse} from "@/api/models/auth";
import {useSession} from "@/context/SessionContext";
import axios, {AxiosError, InternalAxiosRequestConfig} from "axios";
import {ENV} from "@/config/environment";

export function useHttpClient() {
    const {session, login, logout} = useSession()

    const httpClient = axios.create({
        baseURL: ENV.apiUrl,
        timeout: 30_000,
    })

    const refreshAccessToken = async (refreshToken: string): Promise<string> => {
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
            const originalRequest = err.config;

            if (err.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
                if (session?.refreshToken) {
                    (originalRequest as any)._retry = true;

                    try {
                        const accessToken = await refreshAccessToken(session.refreshToken);
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return httpClient(originalRequest);
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        logout();
                        return Promise.reject(refreshError);
                    }
                } else {
                    console.log('No refresh token available, logging out');
                    logout();
                }
            }
            return Promise.reject(err);
        }
    )

    return httpClient
}
