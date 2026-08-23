"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

const getErrorMessage = (error: unknown) => (
    error instanceof Error ? error.message : "Something went wrong"
);

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [challengeToken, setChallengeToken] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.get("session") !== "expired") {
            return;
        }

        const messageTimer = window.setTimeout(() => {
            setIsError(true);
            setMessage("Your session has expired. Please sign in again.");
        }, 0);

        return () => window.clearTimeout(messageTimer);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            if (
                data.mfaRequired === true
                && typeof data.challengeToken === "string"
                && data.challengeToken
            ) {
                setChallengeToken(data.challengeToken);
                setPassword("");
                setOtp("");
                setIsError(false);
                setMessage("A 6-digit verification code was sent to your email.");
                return;
            }

            if (typeof data.token !== "string" || !data.token) {
                throw new Error("Unable to complete sign in");
            }

            localStorage.setItem(
                "token",
                data.token
            );

            setIsError(false);
            setMessage("Login successful");
            router.push("/dashboard");
        } catch (error: unknown) {
            setIsError(true);
            setMessage(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOtpVerification = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!challengeToken || !/^\d{6}$/.test(otp)) {
            setIsError(true);
            setMessage("Enter the 6-digit verification code sent to your email.");
            return;
        }

        setIsSubmitting(true);

        try {
            const data = await apiRequest("/auth/verify-otp", {
                method: "POST",
                body: JSON.stringify({
                    challengeToken,
                    otp
                }),
            });

            if (typeof data.token !== "string" || !data.token) {
                throw new Error("Unable to complete verification");
            }

            localStorage.setItem(
                "token",
                data.token
            );

            setIsError(false);
            setMessage("Login successful");
            router.push("/dashboard");
        } catch {
            setIsError(true);
            setMessage("The verification code is invalid or expired. Please sign in again if you need a new code.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const returnToLogin = () => {
        setChallengeToken(null);
        setOtp("");
        setMessage("");
        setIsError(false);
    };

    return (
        <main className="relative flex min-h-screen overflow-hidden bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -left-32 top-1/4 size-96 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-blue-600/10 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
            </div>

            <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
                <section className="hidden lg:block">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.1)]">
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 19 6v5.2c0 4.2-2.85 7.7-7 9.3-4.15-1.6-7-5.1-7-9.3V6l7-2.5Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 11.5h5v4h-5zM10.5 11.5V10a1.5 1.5 0 0 1 3 0v1.5" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-white">SecureNotes</p>
                            <p className="text-xs text-slate-400">Private by design. Secure by default.</p>
                        </div>
                    </div>

                    <h1 className="mt-12 max-w-xl text-5xl font-semibold leading-tight tracking-tight text-white">
                        Return to your private workspace.
                    </h1>
                    <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
                        Sign in to access notes protected with authenticated encryption and secure account controls.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-3">
                        {["AES-256-GCM encrypted", "JWT protected", "Private storage"].map((item) => (
                            <div key={item} className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-300">
                                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4 4L19 7" />
                                </svg>
                                {item}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto w-full max-w-md">
                    <div className="mb-8 flex items-center gap-3 lg:hidden">
                        <div className="flex size-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 19 6v5.2c0 4.2-2.85 7.7-7 9.3-4.15-1.6-7-5.1-7-9.3V6l7-2.5Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 11.5h5v4h-5zM10.5 11.5V10a1.5 1.5 0 0 1 3 0v1.5" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-white">SecureNotes</p>
                            <p className="text-xs text-slate-400">Encrypted note management</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-8">
                        <div className="mb-7">
                            <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold tracking-tight text-white">
                                {challengeToken ? "Verify your identity" : "Welcome back"}
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                {challengeToken
                                    ? `Enter the verification code sent to ${email}.`
                                    : "Enter your credentials to unlock your secure workspace."}
                            </p>
                        </div>

                        {challengeToken ? (
                            <form onSubmit={handleOtpVerification} className="space-y-5">
                                <div>
                                    <label htmlFor="otp" className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                                        Verification code
                                    </label>
                                    <input
                                        id="otp"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]{6}"
                                        maxLength={6}
                                        placeholder="6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        className="min-h-12 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 text-center text-lg tracking-[0.35em] text-slate-100 outline-none transition placeholder:text-sm placeholder:tracking-normal placeholder:text-slate-600 hover:border-slate-600 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10"
                                        autoComplete="one-time-code"
                                        aria-describedby="otp-help"
                                        autoFocus
                                        required
                                    />
                                    <p id="otp-help" className="mt-2 text-xs leading-5 text-slate-500">
                                        Enter exactly 6 numeric digits.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || otp.length !== 6}
                                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmitting ? "Verifying..." : "Verify and sign in"}
                                </button>

                                <button
                                    type="button"
                                    onClick={returnToLogin}
                                    disabled={isSubmitting}
                                    className="w-full text-sm font-medium text-cyan-300 transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Back to sign in
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="min-h-12 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10"
                                        autoComplete="email"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="min-h-12 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10"
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmitting ? "Signing in..." : "Sign in securely"}
                                    {!isSubmitting && (
                                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-4-4 4 4-4 4" />
                                        </svg>
                                    )}
                                </button>
                            </form>
                        )}

                        {message && (
                            <p
                                role="status"
                                className={`mt-5 flex items-start gap-2 rounded-lg border px-3 py-3 text-sm ${
                                    isError
                                        ? "border-red-400/20 bg-red-400/10 text-red-200"
                                        : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                                }`}
                            >
                                <span aria-hidden="true">{isError ? "!" : "✓"}</span>
                                {message}
                            </p>
                        )}

                        <p className="mt-7 border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
                            New to SecureNotes?{" "}
                            <Link href="/register" className="font-medium text-cyan-300 transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70">
                                Create an account
                            </Link>
                        </p>
                    </div>

                    <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M7 10.5h10v9H7z" />
                        </svg>
                        Protected access to your encrypted vault
                    </p>
                </section>
            </div>
        </main>
    );
}
