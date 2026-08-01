"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { AUDIT_LOG_UPDATED_EVENT } from "@/lib/audit";

interface AuditLog {
    id: number;
    action: string;
    createdAt: string;
}

const activityDetails: Record<string, {
    label: string;
    description: string;
    color: string;
}> = {
    LOGIN: {
        label: "Secure sign-in",
        description: "Your account was accessed successfully.",
        color: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
    },
    NOTE_CREATED: {
        label: "Note created",
        description: "A new encrypted note was added.",
        color: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
    },
    NOTE_UPDATED: {
        label: "Note updated",
        description: "An encrypted note was changed.",
        color: "border-amber-400/20 bg-amber-400/10 text-amber-300"
    },
    NOTE_DELETED: {
        label: "Note deleted",
        description: "An encrypted note was permanently removed.",
        color: "border-red-400/20 bg-red-400/10 text-red-300"
    }
};

const defaultActivity = {
    label: "Security event",
    description: "Account security activity was recorded.",
    color: "border-slate-600 bg-slate-800 text-slate-300"
};

const formatTimestamp = (timestamp: string) => (
    new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(timestamp))
);

const ActivityIcon = ({ action }: { action: string }) => {
    if (action === "LOGIN") {
        return (
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 7V5.75A1.75 1.75 0 0 1 11.75 4h6.5A1.75 1.75 0 0 1 20 5.75v12.5A1.75 1.75 0 0 1 18.25 20h-6.5A1.75 1.75 0 0 1 10 18.25V17m-6-5h11m-3-3 3 3-3 3" />
        );
    }

    if (action === "NOTE_CREATED") {
        return <path strokeLinecap="round" d="M12 5v14M5 12h14" />;
    }

    if (action === "NOTE_UPDATED") {
        return <path strokeLinecap="round" strokeLinejoin="round" d="m14.5 5.5 4 4M5 19l3.5-.75L19 7.75 16.25 5 5.75 15.5 5 19Z" />;
    }

    if (action === "NOTE_DELETED") {
        return <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h14M9 7V4.5h6V7m2 0-.7 12H7.7L7 7m3 3v6m4-6v6" />;
    }

    return <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.5 1.5M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />;
};

export default function SecurityActivity() {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAuditLogs = useCallback(async () => {
        try {
            const data = await apiRequest("/audit-logs");
            setAuditLogs(Array.isArray(data) ? data : []);
            setError("");
        } catch (requestError: unknown) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to load security activity"
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const initialLoad = window.setTimeout(() => {
            void loadAuditLogs();
        }, 0);

        const refreshActivity = () => {
            void loadAuditLogs();
        };

        window.addEventListener(AUDIT_LOG_UPDATED_EVENT, refreshActivity);

        return () => {
            window.clearTimeout(initialLoad);
            window.removeEventListener(AUDIT_LOG_UPDATED_EVENT, refreshActivity);
        };
    }, [loadAuditLogs]);

    return (
        <section aria-labelledby="activity-heading" className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10 text-violet-300">
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 19 6v5.2c0 4.2-2.85 7.7-7 9.3-4.15-1.6-7-5.1-7-9.3V6l7-2.5Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M12 9v6" />
                            </svg>
                        </div>
                        <h2 id="activity-heading" className="text-xl font-semibold tracking-tight text-white">
                            Security activity
                        </h2>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                        Recent access and encrypted note events for your account.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => void loadAuditLogs()}
                    className="inline-flex min-h-9 w-fit items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/50 px-3 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7v5h-5M5 17v-5h5M18 12a6 6 0 0 0-10.5-4M6 12a6 6 0 0 0 10.5 4" />
                    </svg>
                    Refresh
                </button>
            </div>

            <div className="px-5 py-5 sm:px-7">
                {isLoading ? (
                    <p role="status" className="text-sm text-slate-500">Loading security activity...</p>
                ) : error ? (
                    <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-3 text-sm text-red-200">
                        {error}
                    </p>
                ) : auditLogs.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/30 px-5 py-8 text-center">
                        <p className="text-sm font-medium text-slate-300">No security activity yet</p>
                        <p className="mt-1 text-xs text-slate-500">New account events will appear here.</p>
                    </div>
                ) : (
                    <ol className="divide-y divide-slate-800">
                        {auditLogs.map((log) => {
                            const activity = activityDetails[log.action] || defaultActivity;

                            return (
                                <li key={log.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                    <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${activity.color}`}>
                                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <ActivityIcon action={log.action} />
                                        </svg>
                                    </div>
                                    <div className="min-w-0 flex-1 sm:flex sm:items-start sm:justify-between sm:gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-200">{activity.label}</p>
                                            <p className="mt-1 text-xs leading-5 text-slate-500">{activity.description}</p>
                                        </div>
                                        <time dateTime={log.createdAt} className="mt-2 block shrink-0 text-xs text-slate-500 sm:mt-0">
                                            {formatTimestamp(log.createdAt)}
                                        </time>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                )}
            </div>
        </section>
    );
}
