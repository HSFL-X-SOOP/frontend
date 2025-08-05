import {useState, FormEvent, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Input,
    Button,
    Checkbox,
} from "@heroui/react";
import {useAuth} from "@/hooks/useAuth.ts";
import {NavItems} from "@/types";
import DefaultLayout from "@/layouts/DefaultLayout.tsx";
import {AnimatedIconSwap, EyeIcon, EyeSlashIcon, GoogleIcon, MagicLinkIcon} from "@/components/Icons.tsx";
import {useSession} from "@/context/SessionContext.tsx";

export default function Login() {
    const navigate = useNavigate();
    const {login: logUserIn, loginStatus} = useAuth();
    const {login, session} = useSession()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (session) {
            navigate("/");
        }
    }, [session, navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await logUserIn({email, password, rememberMe});
        let data = loginStatus.data
        if (data != null && !loginStatus.error) {
            login({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                loggedInSince: new Date(),
                lastTokenRefresh: null
            });
            navigate("/");
        } else {
            // TODO: ADD ERROR BANNER
            console.error("Registration failed:", loginStatus.error);
        }
    };

    return (
        <DefaultLayout activeItem={NavItems.LOGIN}>
            <section className="h-[calc(100vh-65px)] relative bg-content1 flex items-center justify-center">
                <Card
                    className="w-full max-w-md bg-content1 dark:bg-content2 shadow-xl rounded-2xl border border-default-200 dark:border-default-50">
                    <CardHeader className="flex flex-col items-center gap-1 text-center pb-0">
                        <h1 className="font-oswald text-3xl">Sign in</h1>
                        <p className="text-sm mt-1">
                            Welcome back! Please enter your credentials.
                        </p>
                    </CardHeader>

                    <CardBody className="pt-6">
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
                            />

                            <Input
                                id="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                isRequired
                                autoComplete="current-password"
                                value={password}
                                onValueChange={setPassword}
                                placeholder="••••••••"
                                endContent={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(p => !p)}
                                        className="flex h-9 w-9 items-center justify-center rounded-full focus:outline-none hover:bg-primary-100/60 text-primary-600 dark:text-primary-400"
                                    >
                                        {AnimatedIconSwap(
                                            showPassword,
                                            (props) => <EyeIcon {...props} size={20}/>,
                                            (props) => <EyeSlashIcon {...props} size={20}/>
                                        )}
                                    </button>
                                }
                            />

                            {loginStatus.error && (
                                <p className="text-danger-500 text-sm">{loginStatus.error.message}</p>
                            )}

                            <div className="flex items-center justify-between">
                                <Checkbox size="sm" isSelected={rememberMe} onValueChange={setRememberMe}>
                                    Remember me
                                </Checkbox>

                                <Link to="/forgot-password"
                                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                color="primary"
                                fullWidth
                                isLoading={loginStatus.loading}
                                disabled={loginStatus.loading}
                            >
                                Sign in
                            </Button>
                        </form>
                    </CardBody>

                    <CardFooter className="flex flex-col space-y-6">
                        <div className="flex items-center w-full">
                            <hr className="flex-grow border-default-200 dark:border-default-50"/>
                            <span className="mx-2 text-default-500 text-sm">or</span>
                            <hr className="flex-grow border-default-200 dark:border-default-50"/>
                        </div>
                        <Button
                            variant="bordered"
                            color="default"
                            fullWidth
                            onPress={() => window.location.assign("/api/login/google")}
                            className="flex items-center justify-center"
                        >
                            <GoogleIcon size={24}/>
                            Sign in with Google
                        </Button>

                        <Button
                            variant="bordered"
                            color="default"
                            fullWidth
                            onPress={() => navigate("/magic-link")}
                            className="flex items-center justify-center"
                        >
                            <MagicLinkIcon size={30}/>
                            Sign in with Email Magic Link
                        </Button>

                        <p className="text-sm w-full text-center">
                            Don't have an account? {" "}
                            <Link
                                to="/register"
                                className="text-primary-600 dark:text-primary-400 hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </section>
        </DefaultLayout>
    );
}
