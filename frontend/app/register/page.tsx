"use client";

import Link from "next/link";
import { useState } from "react";
import { apiRequest } from "@/lib/api";

const getErrorMessage = (error: unknown) => (
    error instanceof Error ? error.message : "Something went wrong"
);

const getPasswordStrength = (password: string) => {
    const score = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[a-z]/.test(password),
        /\d/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;

    if (score <= 2) {
        return { score, label: "Weak", color: "bg-red-400", textColor: "text-red-300" };
    }

    if (score <= 4) {
        return { score, label: "Medium", color: "bg-amber-400", textColor: "text-amber-300" };
    }

    return { score, label: "Strong", color: "bg-emerald-400", textColor: "text-emerald-300" };
};

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const passwordStrength = getPasswordStrength(password);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = await apiRequest("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            setIsError(false);
            setMessage(data.message);
        } catch (error: unknown) {
            setIsError(true);
            setMessage(getErrorMessage(error));
        }
    };

    return (
        <main className="relative flex min-h-screen overflow-hidden bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -left-32 bottom-0 size-96 rounded-full bg-blue-600/10 blur-3xl" />
                <div className="absolute -right-32 top-1/4 size-96 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
            </div>

            <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
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
                                    <circle cx="9" cy="8" r="3" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 19a5.5 5.5 0 0 1 11 0M18 10v6m-3-3h6" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight text-white">Create your secure account</h1>
                            <p className="mt-2 text-sm leading-6 text-slate-400">Start a private workspace for your encrypted notes.</p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-5">
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
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="min-h-12 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10"
                                    autoComplete="new-password"
                                    required
                                />
                                {password && (
                                    <div className="mt-3" aria-live="polite">
                                        <div className="mb-2 flex items-center justify-between text-xs">
                                            <span className="text-slate-500">Password strength</span>
                                            <span className={`font-semibold ${passwordStrength.textColor}`}>
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <div
                                            role="progressbar"
                                            aria-label="Password strength"
                                            aria-valuemin={0}
                                            aria-valuemax={5}
                                            aria-valuenow={passwordStrength.score}
                                            aria-valuetext={passwordStrength.label}
                                            className="grid grid-cols-5 gap-1.5"
                                        >
                                            {Array.from({ length: 5 }, (_, index) => (
                                                <span
                                                    key={index}
                                                    className={`h-1.5 rounded-full transition-colors duration-300 ${
                                                        index < passwordStrength.score
                                                            ? passwordStrength.color
                                                            : "bg-slate-700"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="mt-2 text-xs leading-5 text-slate-500">
                                            Use 8+ characters with uppercase, lowercase, a number, and a special character.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                            >
                                Create secure account
                                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-4-4 4 4-4 4" />
                                </svg>
                            </button>
                        </form>

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
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-cyan-300 transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M7 10.5h10v9H7z" />
                        </svg>
                        Your notes are protected with AES-256-GCM
                    </p>
                </section>

                <section className="hidden lg:block lg:pl-12">
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

                    <h2 className="mt-12 max-w-xl text-5xl font-semibold leading-tight tracking-tight text-white">
                        A safer place for your private thoughts.
                    </h2>
                    <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
                        Create your account and keep sensitive notes behind strong encryption and authenticated access.
                    </p>

                    <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                        {[
                            ["256-bit", "Encryption"],
                            ["JWT", "Authentication"],
                            ["24/7", "Private access"],
                        ].map(([value, label]) => (
                            <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                                <p className="text-lg font-semibold text-cyan-300">{value}</p>
                                <p className="mt-1 text-xs text-slate-500">{label}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
