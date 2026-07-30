const express = require("express");

const router = express.Router();

const {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote
} = require("../controllers/noteController");
const authMiddleware = require("../middleware/authMiddleware");


router.use(authMiddleware);

router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);


module.exports = router;
