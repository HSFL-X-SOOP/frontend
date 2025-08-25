import {FormEvent, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Input,
    Button,
    Checkbox,
} from "@heroui/react";
import DefaultLayout from "@/layouts/DefaultLayout";
import {NavItems} from "@/types";
import {EyeIcon, EyeSlashIcon, GoogleIcon} from "@/components/Icons";
import {useAuth} from "@/hooks/useAuth.ts";
import {useSession} from "@/context/SessionContext.tsx";
import {AnimatedIconSwap} from "@/components/iconSwapButton.tsx";

export default function Register() {
    const navigate = useNavigate();
    const {register, registerStatus} = useAuth();
    const {login, session} = useSession()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [acceptTos, setAcceptTos] = useState(false);
    const [showPw, setShowPw] = useState(false);

    useEffect(() => {
        if (session) {
            navigate("/");
        }
    }, [session, navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirm) return;
        if (!acceptTos) return;

        const res = await register({email, password, rememberMe: false});
        if (res) {
            login({
                accessToken: res.accessToken,
                refreshToken: res.refreshToken,
                loggedInSince: new Date(),
                lastTokenRefresh: null
            });
            navigate("/");
        } else {
            // TODO: ADD ERROR BANNER
            console.error("Registration failed:", registerStatus.error);
        }
    };

    return (
        <DefaultLayout activeItem={NavItems.LOGIN}>
            <section className="h-[calc(100vh-65px)] bg-content1 flex items-center justify-center">
                <Card
                    className="w-full max-w-md bg-content1 dark:bg-content2 shadow-xl rounded-2xl border border-default-200 dark:border-default-50">
                    <CardHeader className="flex flex-col items-center gap-1 text-center pb-0">
                        <h1 className="font-oswald text-3xl">Create account</h1>
                        <p className="text-sm mt-1">Join us by filling out the information below.</p>
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
                                type={showPw ? "text" : "password"}
                                isRequired
                                autoComplete="new-password"
                                value={password}
                                onValueChange={setPassword}
                                placeholder="••••••••"
                                endContent={
                                    <button
                                        type="button"
                                        onClick={() => setShowPw((v) => !v)}
                                        className="flex h-9 w-9 items-center justify-center rounded-full focus:outline-none hover:bg-primary-100/60 text-primary-600 dark:text-primary-400"
                                    >
                                        {AnimatedIconSwap(
                                            showPw,
                                            (props) => <EyeIcon {...props} size={20}/>,
                                            (props) => <EyeSlashIcon {...props} size={20}/>
                                        )}
                                    </button>
                                }
                            />

                            <Input
                                id="confirm"
                                label="Confirm Password"
                                type={showPw ? "text" : "password"}
                                isRequired
                                autoComplete="new-password"
                                value={confirm}
                                onValueChange={setConfirm}
                                placeholder="••••••••"
                                endContent={
                                    <button
                                        type="button"
                                        onClick={() => setShowPw((v) => !v)}
                                        className="flex h-9 w-9 items-center justify-center rounded-full focus:outline-none hover:bg-primary-100/60 text-primary-600 dark:text-primary-400"
                                    >
                                        {AnimatedIconSwap(
                                            showPw,
                                            (props) => <EyeIcon {...props} size={20}/>,
                                            (props) => <EyeSlashIcon {...props} size={20}/>
                                        )}
                                    </button>
                                }
                            />

                            {registerStatus.error && (
                                <p className="text-danger-500 text-sm">
                                    {registerStatus.error.message}
                                </p>
                            )}

                            <Checkbox
                                size="sm"
                                isSelected={acceptTos}
                                onValueChange={setAcceptTos}
                            >
                                I agree to the&nbsp;
                                <Link
                                    to="/terms"
                                    className="text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    Terms of Service
                                </Link>
                            </Checkbox>

                            <Button
                                type="submit"
                                color="primary"
                                fullWidth
                                isLoading={registerStatus.loading}
                                disabled={registerStatus.loading}
                            >
                                Sign up
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
                            Sign up with Google
                        </Button>

                        <p className="text-sm w-full text-center">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-primary-600 dark:text-primary-400 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </section>
        </DefaultLayout>
    );
}
