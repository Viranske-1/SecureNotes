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
        ? [{ href: "/admin", label: "Admin" }, { href: "/admin/audit-logs", label: "Audit logs" }]
        : [{ href: "/dashboard", label: "Workspace" }, { href: "/dashboard#notes-heading", label: "Notes" }];
    const logout = () => { localStorage.removeItem("token"); router.push("/login"); };

    return (
        <div className="page-shell min-h-screen text-[#1A1A1A]">
            <header className="sticky top-0 z-30 border-b border-[#DEDDD8] bg-[#F4F3EF]/95">
                <div className="content-container flex h-[76px] items-center gap-6">
                    <Brand compact />
                    <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:ml-8 md:flex">
                        {links.map((link) => {
                            const active = link.href.split("#")[0] === pathname;
                            return <Link key={link.href} href={link.href} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-white text-[#1A1A1A]" : "text-[#6B6B6B] hover:text-[#1A1A1A]"}`}>{link.label}</Link>;
                        })}
                    </nav>
                    <div className="ml-auto hidden md:block"><button type="button" onClick={logout} className="btn-secondary min-h-10">Log out</button></div>
                    <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation" className="btn-secondary size-11 px-0 md:hidden">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d={open ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} /></svg>
                    </button>
                </div>
                {open && <nav aria-label="Mobile navigation" className="content-container grid gap-2 border-t border-[#DEDDD8] bg-[#FAF9F6] py-4 md:hidden">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-[#444] hover:bg-white">{link.label}</Link>)}<button type="button" onClick={logout} className="mt-1 rounded-lg px-3 py-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50">Log out</button></nav>}
            </header>
            <main className="content-container py-10 sm:py-14"><div className="page-stage">{children}</div></main>
        </div>
    );
}
