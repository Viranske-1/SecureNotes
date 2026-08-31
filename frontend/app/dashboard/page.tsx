"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import Notes from "@/components/Notes";
import SecurityActivity from "@/components/SecurityActivity";

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("token")) router.push("/login");
    }, [router]);

    return (
        <AppShell>
            <header className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-3xl">
                    <span className="eyebrow">Secure workspace</span>
                    <h1 className="mt-4 text-4xl font-bold leading-[1.02] tracking-[-.04em] text-[#1A1A1A] sm:text-5xl">Your secure workspace</h1>
                    <p className="mt-4 text-base leading-7 text-[#6B6B6B]">Manage encrypted notes and review your security activity.</p>
                </div>
                <a href="#note-form" className="btn-primary w-fit">Create note</a>
            </header>

            <section aria-label="Security overview" className="mt-12 grid gap-4 md:grid-cols-3">
                {[
                    ["Encryption", "AES-256-GCM", "Your notes remain encrypted at rest."],
                    ["MFA", "Email OTP enabled", "A second factor protects every sign-in."],
                    ["Security", "Audit logging active", "Account and note events stay reviewable."],
                ].map(([label, value, copy]) => (
                    <article key={label} className="surface p-5">
                        <span className="size-2.5 rounded-full bg-orange-500" />
                        <p className="mt-8 text-xs font-bold uppercase tracking-[.12em] text-[#595954]">{label}</p>
                        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1A1A1A]">{value}</h2>
                        <p className="mt-3 max-w-sm text-sm leading-6 text-[#5F5F5B]">{copy}</p>
                    </article>
                ))}
            </section>

            <div className="mt-16"><Notes /></div>
            <SecurityActivity />
        </AppShell>
    );
}
