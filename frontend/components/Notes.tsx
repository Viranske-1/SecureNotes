"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { AUDIT_LOG_UPDATED_EVENT } from "@/lib/audit";

interface Note {
    id: number;
    title: string;
    content: string;
}

const getErrorMessage = (error: unknown) => (
    error instanceof Error ? error.message : "Something went wrong"
);

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        apiRequest("/notes")
            .then((data) => setNotes(Array.isArray(data) ? data : []))
            .catch((error: unknown) => setMessage(getErrorMessage(error)));
    }, []);

    const resetForm = () => {
        setTitle("");
        setContent("");
        setEditingId(null);
    };

    const saveNote = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            if (editingId === null) {
                const createdNote = await apiRequest("/notes", {
                    method: "POST",
                    body: JSON.stringify({ title, content }),
                });

                setNotes((currentNotes) => [createdNote, ...currentNotes]);
                setMessage("Note created successfully");
                window.dispatchEvent(new Event(AUDIT_LOG_UPDATED_EVENT));
            } else {
                const updatedNote = await apiRequest(`/notes/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify({ title, content }),
                });

                setNotes((currentNotes) => [
                    updatedNote,
                    ...currentNotes.filter((note) => note.id !== editingId),
                ]);
                setMessage("Note updated successfully");
                window.dispatchEvent(new Event(AUDIT_LOG_UPDATED_EVENT));
            }

            resetForm();
        } catch (error: unknown) {
            setMessage(getErrorMessage(error));
        }
    };

    const startEditing = (note: Note) => {
        setEditingId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setMessage("");
    };

    const deleteNote = async (id: number) => {
        try {
            await apiRequest(`/notes/${id}`, {
                method: "DELETE",
            });

            setNotes((currentNotes) => (
                currentNotes.filter((note) => note.id !== id)
            ));

            if (editingId === id) {
                resetForm();
            }

            setMessage("Note deleted successfully");
            window.dispatchEvent(new Event(AUDIT_LOG_UPDATED_EVENT));
        } catch (error: unknown) {
            setMessage(getErrorMessage(error));
        }
    };

    return (
        <section aria-labelledby="notes-heading" className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="flex flex-col gap-2 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 4.5h7.5L19 9v10.5H7a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 4.5V9H19M9 13h6M9 16h4" />
                            </svg>
                        </div>
                        <h2 id="notes-heading" className="text-xl font-semibold tracking-tight text-white">Encrypted notes</h2>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">Create, review, and manage your secure records.</p>
                </div>
                <div className="w-fit rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs font-medium text-slate-300">
                    {notes.length} {notes.length === 1 ? "note" : "notes"}
                </div>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                <form onSubmit={saveNote} className="border-b border-slate-800 p-5 sm:p-7 lg:border-b-0 lg:border-r">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-100">
                            {editingId === null ? "Create a new note" : "Edit note"}
                        </h3>
                        {editingId !== null && (
                            <span className="rounded-md bg-amber-400/10 px-2 py-1 text-xs font-medium text-amber-300">Editing</span>
                        )}
                    </div>

                    <div className="mt-5">
                        <label htmlFor="note-title" className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                            Title
                        </label>
                        <input
                            id="note-title"
                            placeholder="e.g. Recovery codes"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            className="min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="note-content" className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                            Private content
                        </label>
                        <textarea
                            id="note-content"
                            placeholder="Write something you want to keep secure..."
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            className="min-h-40 w-full resize-y rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-3 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10"
                            required
                        />
                    </div>

                    <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row">
                        {editingId !== null && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="min-h-11 rounded-lg border border-slate-700 px-4 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
                            >
                                Cancel
                            </button>
                        )}
                        <button className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                                {editingId === null ? (
                                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4 4L19 7" />
                                )}
                            </svg>
                            {editingId === null ? "Create encrypted note" : "Save changes"}
                        </button>
                    </div>

                    <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-slate-500">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M7 10.5h10v9H7z" />
                        </svg>
                        Content is encrypted before secure storage.
                    </p>

                    {message && (
                        <p role="status" className="mt-4 rounded-lg border border-cyan-400/15 bg-cyan-400/5 px-3 py-2.5 text-sm text-cyan-200">
                            {message}
                        </p>
                    )}
                </form>

                <div className="p-5 sm:p-7">
                    {notes.length === 0 ? (
                        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/30 px-6 py-12 text-center">
                            <div className="flex size-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400">
                                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4.5h7.5L19 9v10.5H7a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 4.5V9H19M9 13h6M9 16h4" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-slate-200">Your vault is ready</h3>
                            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                                No notes yet. Create your first encrypted note using the secure form.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            {notes.map((note) => (
                                <article
                                    key={note.id}
                                    className="group flex min-h-48 flex-col rounded-xl border border-slate-800 bg-slate-950/55 p-5 transition hover:border-slate-700 hover:bg-slate-950/80"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M7 10.5h10v9H7z" />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-400/80">Encrypted</span>
                                    </div>
                                    <h3 className="mt-4 break-words text-base font-semibold text-slate-100">{note.title}</h3>
                                    <p className="mt-2 line-clamp-4 flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-400">
                                        {note.content}
                                    </p>

                                    <div className="mt-5 flex gap-2 border-t border-slate-800 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => startEditing(note)}
                                            className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-medium text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
                                        >
                                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.5 5.5 4 4M5 19l3.5-.75L19 7.75 16.25 5 5.75 15.5 5 19Z" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => void deleteNote(note.id)}
                                            className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-400/20 bg-red-400/5 px-3 text-xs font-medium text-red-300 transition hover:border-red-400/40 hover:bg-red-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70"
                                        >
                                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h14M9 7V4.5h6V7m2 0-.7 12H7.7L7 7m3 3v6m4-6v6" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
