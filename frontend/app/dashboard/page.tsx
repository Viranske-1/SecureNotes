"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Notes from "@/components/Notes";
import SecurityActivity from "@/components/SecurityActivity";

const securityFeatures = [
    {
        title: "AES-256-GCM Encryption",
        description: "Authenticated encryption keeps every note confidential and tamper-resistant.",
        icon: (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.75a4.5 4.5 0 0 0-9 0v2.75m-.75 0h10.5A1.75 1.75 0 0 1 19 12.25v6A1.75 1.75 0 0 1 17.25 20H6.75A1.75 1.75 0 0 1 5 18.25v-6a1.75 1.75 0 0 1 1.75-1.75Z" />
                <path strokeLinecap="round" d="M12 14.25v2" />
            </svg>
        ),
    },
    {
        title: "JWT Authentication",
        description: "Token-based access control protects your account and private workspace.",
        icon: (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 19 6v5.2c0 4.2-2.85 7.7-7 9.3-4.15-1.6-7-5.1-7-9.3V6l7-2.5Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.25 12 1.7 1.7 3.8-4" />
            </svg>
        ),
    },
    {
        title: "PostgreSQL Secure Storage",
        description: "Reliable persistent storage keeps encrypted records safe and available.",
        icon: (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <ellipse cx="12" cy="6" rx="7" ry="3" />
                <path strokeLinecap="round" d="M5 6v6c0 1.65 3.13 3 7 3s7-1.35 7-3V6M5 12v6c0 1.65 3.13 3 7 3s7-1.35 7-3v-6" />
            </svg>
        ),
    },
];

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
        }
    }, [router]);

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute right-0 top-80 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
            </div>

            <div className="relative mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <header className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.08)]">
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 19 6v5.2c0 4.2-2.85 7.7-7 9.3-4.15-1.6-7-5.1-7-9.3V6l7-2.5Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 11.5h5v4h-5zM10.5 11.5V10a1.5 1.5 0 0 1 3 0v1.5" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-base font-semibold tracking-tight text-white sm:text-lg">SecureNotes</p>
                            <p className="hidden text-xs text-slate-400 sm:block">Private by design. Secure by default.</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={logout}
                        className="group inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-3.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
                    >
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 8V5.75A1.75 1.75 0 0 0 12.25 4h-6.5A1.75 1.75 0 0 0 4 5.75v12.5A1.75 1.75 0 0 0 5.75 20h6.5A1.75 1.75 0 0 0 14 18.25V16m-3-4h9m-3-3 3 3-3 3" />
                        </svg>
                        Log out
                    </button>
                </header>

                <section className="py-12 sm:py-16">
                    <div className="max-w-3xl">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                            </span>
                            Secure workspace active
                        </div>
                        <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                            Your ideas, protected from everyone but you.
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                            Welcome back. Create and manage private notes in a workspace built around strong encryption, authenticated access, and secure storage.
                        </p>
                    </div>

                    <div className="mt-9 grid gap-4 md:grid-cols-3">
                        {securityFeatures.map((feature) => (
                            <article
                                key={feature.title}
                                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-black/10 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-slate-900"
                            >
                                <div className="flex size-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition group-hover:border-cyan-400/30 group-hover:bg-cyan-400/15">
                                    {feature.icon}
                                </div>
                                <h2 className="mt-4 text-sm font-semibold text-slate-100">{feature.title}</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <Notes />

                <SecurityActivity />

                <footer className="mt-14 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
                    SecureNotes · Encrypted note management
                </footer>
            </div>
        </main>
    );
}
