"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

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
        } catch (error: unknown) {
            setMessage(getErrorMessage(error));
        }
    };

    return (
        <div className="mt-10">
            <h2 className="mb-5 text-2xl font-bold">
                My Encrypted Notes 🔐
            </h2>

            <form
                onSubmit={saveNote}
                className="space-y-3 rounded border p-5"
            >
                <input
                    placeholder="Note title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="w-full rounded border p-3"
                    required
                />

                <textarea
                    placeholder="Secret content"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    className="w-full rounded border p-3"
                    required
                />

                <div className="flex gap-2">
                    <button className="rounded bg-black px-5 py-2 text-white">
                        {editingId === null ? "Create Note" : "Save Changes"}
                    </button>

                    {editingId !== null && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded border px-5 py-2"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {message && <p className="mt-3">{message}</p>}

            <div className="mt-8 space-y-4">
                {notes.map((note) => (
                    <div key={note.id} className="rounded border p-5">
                        <h3 className="text-xl font-bold">{note.title}</h3>
                        <p className="mt-2 whitespace-pre-wrap">
                            {note.content}
                        </p>

                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={() => startEditing(note)}
                                className="rounded bg-blue-600 px-4 py-2 text-white"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => void deleteNote(note.id)}
                                className="rounded bg-red-600 px-4 py-2 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
