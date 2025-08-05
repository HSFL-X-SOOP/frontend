import {useState, FormEvent, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Input,
    Button,
    Spinner,
} from "@heroui/react";
import DefaultLayout from "@/layouts/DefaultLayout.tsx";
import {NavItems} from "@/types";
import {useAuth} from "@/hooks/useAuth.ts";
import {useSession} from "@/context/SessionContext.tsx";

export default function MagicLink() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const tokenParam = searchParams.get("token");

    const {
        requestMagicLink,
        requestMagicLinkStatus,
        magicLinkLogin,
        magicLinkLoginStatus,
    } = useAuth();

    const {login, session} = useSession();

    useEffect(() => {
        if (session) {
            navigate("/");
        }
    }, [session, navigate]);

    useEffect(() => {
        if (!tokenParam) return;
        magicLinkLogin({token: tokenParam});
    }, [tokenParam, magicLinkLogin]);

    useEffect(() => {
        const {loading, error, data} = magicLinkLoginStatus;
        if (!loading && !error && data) {
            login({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                loggedInSince: new Date(),
                lastTokenRefresh: null
            });
            navigate("/");
        }
    }, [magicLinkLoginStatus, login, navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await requestMagicLink({email});
    };

    const {
        loading: sendLoading,
        error: sendError,
        data: sendData,
    } = requestMagicLinkStatus;
    const sendSuccess = !sendLoading && !sendError && sendData != null;

    const {
        loading: loginLoading,
        error: loginError,
    } = magicLinkLoginStatus;

    return (
        <DefaultLayout activeItem={NavItems.LOGIN}>
            <section className="h-[calc(100vh-65px)] bg-content1 flex items-center justify-center">
                <Card
                    className="w-full max-w-md bg-content1 dark:bg-content2 shadow-xl rounded-2xl border border-default-200 dark:border-default-50">
                    <CardHeader className="flex flex-col items-center gap-1 text-center pb-0">
                        {tokenParam ? (
                            <>
                                <h1 className="font-oswald text-3xl">Signing you in…</h1>
                                <p className="text-sm mt-1">
                                    We’re verifying your magic link. Please wait.
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="font-oswald text-3xl">Send Magic Link</h1>
                                <p className="text-sm mt-1">
                                    Enter your email and we’ll send you a sign-in link.
                                </p>
                            </>
                        )}
                    </CardHeader>

                    <CardBody className="pt-6">
                        {tokenParam && (
                            <>
                                {loginLoading && (
                                    <div className="flex flex-col items-center gap-4">
                                        <Spinner size="lg"/>
                                        <p className="text-sm">Logging you in…</p>
                                    </div>
                                )}

                                {loginError && (
                                    <div className="flex flex-col gap-4">
                                        <p className="text-danger-500 text-center">
                                            {loginError.message}
                                        </p>
                                        <Button
                                            variant="bordered"
                                            onPress={() => {
                                                searchParams.delete("token");
                                                setSearchParams(searchParams);
                                            }}
                                        >
                                            Try again
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}

                        {!tokenParam && (
                            <>
                                {sendSuccess ? (
                                    <p className="text-success-600 text-center">
                                        Magic link sent! Check your inbox.
                                    </p>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <Input
                                            id="email"
                                            label="Email"
                                            type="email"
                                            isRequired
                                            autoComplete="email"
                                            value={email}
                                            onValueChange={setEmail}
                                            placeholder="you@example.com"
                                            fullWidth
                                        />

                                        {sendError && (
                                            <p className="text-danger-500 text-sm">{sendError.message}</p>
                                        )}

                                        <Button
                                            type="submit"
                                            color="primary"
                                            fullWidth
                                            isLoading={sendLoading}
                                            disabled={sendLoading}
                                        >
                                            Send Link
                                        </Button>
                                    </form>
                                )}
                            </>
                        )}
                    </CardBody>

                    {!tokenParam && sendSuccess && (
                        <CardFooter className="flex flex-col">
                            <Button variant="light" onPress={() => navigate("/login")}>
                                Back to sign in
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </section>
        </DefaultLayout>
    );
}
