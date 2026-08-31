"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Brand from "@/components/Brand";

export default function AppShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const links = admin
        ? [{ href: "/admin", label: "Admin Dashboard" }, { href: "/admin/audit-logs", label: "Audit Logs" }]
        : [{ href: "/dashboard", label: "Dashboard" }, { href: "/dashboard#notes-heading", label: "Notes" }];
    const logout = () => { localStorage.removeItem("token"); router.push("/login"); };

    return (
        <div className="spatial-bg min-h-screen text-gray-800 lg:grid lg:grid-cols-[256px_minmax(0,1fr)] lg:gap-4 lg:p-4">
            <header className="glass-panel sticky top-0 z-30 flex h-16 items-center justify-between border-x-0 border-t-0 px-4 lg:hidden">
                <Brand compact />
                <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation" className="btn-secondary size-11 px-0">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d={open ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} /></svg>
                </button>
            </header>
            <aside className={`${open ? "flex" : "hidden"} glass-sidebar fixed inset-x-3 top-20 z-20 h-[calc(100vh-6rem)] flex-col rounded-[22px] p-5 lg:sticky lg:top-4 lg:flex lg:h-[calc(100vh-2rem)] lg:rounded-[24px]`}>
                <div className="hidden lg:block"><Brand /></div>
                <nav aria-label="Primary navigation" className="mt-4 space-y-2 lg:mt-10">
                    {links.map((link) => {
                        const active = link.href.split("#")[0] === pathname;
                        return <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={`flex min-h-11 items-center gap-3 rounded-xl border px-3 text-sm font-semibold transition duration-200 ${active ? "border-white/75 bg-orange-100/70 text-orange-700 shadow-[0_8px_18px_rgba(234,88,12,.1),inset_0_1px_0_white]" : "border-transparent text-gray-600 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/45 hover:text-gray-900 hover:shadow-sm"}`}><span className={`size-2 rounded-full ${active ? "bg-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,.12)]" : "bg-gray-300"}`} />{link.label}</Link>;
                    })}
                </nav>
                <div className="glass-card mt-auto rounded-2xl p-3">
                    <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">Secure workspace</p>
                    <button type="button" onClick={logout} className="mt-2 flex min-h-10 w-full items-center rounded-xl px-2 text-sm font-semibold text-gray-600 transition hover:bg-red-50/80 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">Log out</button>
                </div>
            </aside>
            <main className="min-w-0 px-4 py-7 sm:px-6 lg:px-4 lg:py-5"><div className="page-stage mx-auto max-w-6xl">{children}</div></main>
        </div>
    );
}
