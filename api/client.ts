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

    httpClient.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            if (!session) return config

            const threeHoursMS = 3 * 60 * 60 * 1000
            const toleranceMS = 60 * 1000;
            const now = Date.now()
            const age = now - new Date(session.loggedInSince).getTime()

            const needsRefresh =
                session.refreshToken && age >= (threeHoursMS - toleranceMS);

            if (needsRefresh) {
                try {
                    const {data} = await axios.post<LoginResponse>(
                        `${ENV.apiUrl}/auth/refresh`,
                        {refreshToken: session.refreshToken}
                    )

                    const newSession = {
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        loggedInSince: session.loggedInSince,
                        lastTokenRefresh: new Date(),
                        profile: data.profile,
                        role: data.role ?? null
                    }

                    login(newSession)
                    config.headers.Authorization = `Bearer ${newSession.accessToken}`
                } catch (err) {
                    logout()
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
        (err: AxiosError) => {
            if (err.response?.status === 401) logout()
            return Promise.reject(err)
        }
    )

    return httpClient
}
