"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

interface RecentActivity {
    action: string;
    createdAt: string;
    userId: number;
}

interface AdminStats {
    totalUsers: number;
    totalNotes: number;
    totalAuditLogs: number;
    recentActivity: RecentActivity[];
}

const formatTimestamp = (timestamp: string) => (
    new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "medium"
    }).format(new Date(timestamp))
);

export default function AdminDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStats = useCallback(async () => {
        setIsLoading(true);

        try {
            const data = await apiRequest("/admin/stats");
            setStats(data);
            setError("");
        } catch (requestError: unknown) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to load admin statistics"
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            router.replace("/login");
            return;
        }

        const initialLoad = window.setTimeout(() => {
            void loadStats();
        }, 0);

        return () => window.clearTimeout(initialLoad);
    }, [loadStats, router]);

    const cards = stats ? [
        { label: "Total Users", value: stats.totalUsers },
        { label: "Total Notes", value: stats.totalNotes },
        { label: "Total Audit Logs", value: stats.totalAuditLogs }
    ] : [];

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">SecureNotes Admin</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Admin Dashboard</h1>
                        <p className="mt-2 text-sm text-slate-400">System totals and the latest security activity.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/admin/audit-logs" className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white">
                            View Audit Logs
                        </Link>
                        <button type="button" onClick={() => void loadStats()} disabled={isLoading} className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60">
                            Refresh
                        </button>
                    </div>
                </header>

                {isLoading ? (
                    <p role="status" className="py-16 text-center text-sm text-slate-400">Loading admin dashboard...</p>
                ) : error ? (
                    <div role="alert" className="mt-8 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-4 text-sm text-red-200">
                        {error}
                    </div>
                ) : stats ? (
                    <>
                        <section aria-label="System totals" className="mt-8 grid gap-4 md:grid-cols-3">
                            {cards.map((card) => (
                                <article key={card.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/10">
                                    <p className="text-sm font-medium text-slate-400">{card.label}</p>
                                    <p className="mt-3 text-4xl font-semibold tracking-tight text-white">{card.value.toLocaleString()}</p>
                                </article>
                            ))}
                        </section>

                        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/20">
                            <div className="border-b border-slate-800 px-6 py-5">
                                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                                <p className="mt-1 text-sm text-slate-400">The latest 10 audit events.</p>
                            </div>
                            {stats.recentActivity.length === 0 ? (
                                <p className="px-6 py-12 text-center text-sm text-slate-400">No recent activity found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                                        <thead className="bg-slate-950/50 text-xs uppercase tracking-wider text-slate-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 font-medium">Action</th>
                                                <th scope="col" className="px-6 py-4 font-medium">User ID</th>
                                                <th scope="col" className="px-6 py-4 font-medium">Timestamp</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {stats.recentActivity.map((activity, index) => (
                                                <tr key={`${activity.userId}-${activity.createdAt}-${index}`} className="transition hover:bg-slate-800/50">
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-cyan-300">{activity.action}</td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-slate-300">{activity.userId}</td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-slate-400">
                                                        <time dateTime={activity.createdAt}>{formatTimestamp(activity.createdAt)}</time>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </>
                ) : null}
            </div>
        </main>
    );
}
