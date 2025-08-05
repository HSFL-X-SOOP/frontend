import {useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useSession} from "@/context/SessionContext.tsx";
import DefaultLayout from "@/layouts/DefaultLayout.tsx";
import {NavItems} from "@/types";

export default function OAuthCallbackHandler() {
    const navigate = useNavigate();
    const location = useLocation();
    const {login} = useSession();

    useEffect(() => {
        const tokens = (raw: string) => {
            const params = new URLSearchParams(raw);
            return {
                accessToken: params.get("access_token"),
                refreshToken: params.get("refresh_token"),
            } as { accessToken: string | null; refreshToken: string | null };
        };

        const {accessToken, refreshToken} = location.hash
            ? tokens(location.hash.substring(1))
            : tokens(location.search.substring(1));

        if (accessToken) {
            login({
                accessToken: accessToken,
                refreshToken: refreshToken,
                loggedInSince: new Date(),
                lastTokenRefresh: null
            });

            window.history.replaceState({}, document.title, "/");

            navigate("/");
        } else {
            console.error("No tokens found in callback URL");
            navigate("/login");
        }
    }, [location, login, navigate]);

    return (
        <DefaultLayout activeItem={NavItems.LOGIN}>
            <section className="h-[calc(100vh-65px)] flex items-center justify-center">
                <p className="text-default-500 text-lg animate-pulse">Signing you in…</p>
            </section>
        </DefaultLayout>
    );
}
