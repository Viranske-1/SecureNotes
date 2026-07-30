const prisma = require("../config/prisma");
const { encrypt, decrypt } = require("../services/encryptionService");

const isNonEmptyString = (value) => (
    typeof value === "string" && value.trim().length > 0
);

const getNoteId = (value) => {
    if (!/^\d+$/.test(value)) {
        return null;
    }

    const noteId = Number(value);
    return Number.isSafeInteger(noteId) && noteId > 0 ? noteId : null;
};

const serializeNote = (note) => ({
    id: note.id,
    title: note.title,
    content: decrypt(note.encryptedContent),
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
});

const createNote = async (req, res, next) => {
    try {
        const { title, content } = req.body || {};

        if (!isNonEmptyString(title) || !isNonEmptyString(content)) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const note = await prisma.note.create({
            data: {
                title: title.trim(),
                encryptedContent: encrypt(content),
                userId: req.user.userId
            }
        });

        return res.status(201).json(serializeNote(note));
    } catch (error) {
        return next(error);
    }
};

const getNotes = async (req, res, next) => {
    try {
        const notes = await prisma.note.findMany({
            where: {
                userId: req.user.userId
            },
            orderBy: {
                updatedAt: "desc"
            }
        });

        return res.json(notes.map(serializeNote));
    } catch (error) {
        return next(error);
    }
};

const getNoteById = async (req, res, next) => {
    try {
        const noteId = getNoteId(req.params.id);

        if (!noteId) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        const note = await prisma.note.findFirst({
            where: {
                id: noteId,
                userId: req.user.userId
            }
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        return res.json(serializeNote(note));
    } catch (error) {
        return next(error);
    }
};

const updateNote = async (req, res, next) => {
    try {
        const noteId = getNoteId(req.params.id);
        const { title, content } = req.body || {};

        if (!noteId) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        if (!isNonEmptyString(title) || !isNonEmptyString(content)) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const existingNote = await prisma.note.findFirst({
            where: {
                id: noteId,
                userId: req.user.userId
            },
            select: {
                id: true
            }
        });

        if (!existingNote) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        const note = await prisma.note.update({
            where: {
                id: existingNote.id
            },
            data: {
                title: title.trim(),
                encryptedContent: encrypt(content)
            }
        });

        return res.json(serializeNote(note));
    } catch (error) {
        return next(error);
    }
};

const deleteNote = async (req, res, next) => {
    try {
        const noteId = getNoteId(req.params.id);

        if (!noteId) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        const result = await prisma.note.deleteMany({
            where: {
                id: noteId,
                userId: req.user.userId
            }
        });

        if (result.count === 0) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        return res.json({
            message: "Note deleted successfully"
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote
};
