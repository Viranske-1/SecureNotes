"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

interface AuditLog {
    id: number;
    action: string;
    details: string | null;
    userId: number;
    createdAt: string;
}

const formatTimestamp = (timestamp: string) => (
    new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "medium"
    }).format(new Date(timestamp))
);

export default function AdminAuditLogsPage() {
    const router = useRouter();
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAuditLogs = useCallback(async () => {
        setIsLoading(true);

        try {
            const data = await apiRequest("/audit-logs");
            setAuditLogs(Array.isArray(data) ? data : []);
            setError("");
        } catch (requestError: unknown) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to load audit logs"
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
            void loadAuditLogs();
        }, 0);

        return () => window.clearTimeout(initialLoad);
    }, [loadAuditLogs, router]);

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Admin</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Audit logs</h1>
                        <p className="mt-2 text-sm text-slate-400">Recent security and note activity across SecureNotes.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/admin" className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white">
                            Admin Dashboard
                        </Link>
                        <button type="button" onClick={() => void loadAuditLogs()} disabled={isLoading} className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60">
                            Refresh
                        </button>
                    </div>
                </header>

                <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/20">
                    {isLoading ? (
                        <p role="status" className="px-6 py-12 text-center text-sm text-slate-400">Loading audit logs...</p>
                    ) : error ? (
                        <div role="alert" className="m-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-4 text-sm text-red-200">
                            {error}
                        </div>
                    ) : auditLogs.length === 0 ? (
                        <p className="px-6 py-12 text-center text-sm text-slate-400">No audit logs found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                                <thead className="bg-slate-950/50 text-xs uppercase tracking-wider text-slate-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-medium">Action</th>
                                        <th scope="col" className="px-6 py-4 font-medium">User ID</th>
                                        <th scope="col" className="px-6 py-4 font-medium">Details</th>
                                        <th scope="col" className="px-6 py-4 font-medium">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {auditLogs.map((log) => (
                                        <tr key={log.id} className="transition hover:bg-slate-800/50">
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-cyan-300">{log.action}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-slate-300">{log.userId}</td>
                                            <td className="px-6 py-4 text-slate-400">{log.details || "—"}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-slate-400">
                                                <time dateTime={log.createdAt}>{formatTimestamp(log.createdAt)}</time>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
