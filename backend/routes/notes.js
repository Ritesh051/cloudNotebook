const express = require('express');
const fetchuser = require('../Middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes');
const router = express.Router();

// Route 1: Get all notes for logged-in user
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 2: Add a new Note using: POST "/api/auth/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
    body('description')
        .isLength({ min: 5, max: 500 }).withMessage('Description must be between 5 and 500 characters')
], async (req, res) => {
    const { title, description, tag } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const note = new Notes({
            title,
            description,
            tag,
            user: req.user.id
        });

        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error('Error adding note:', error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 3: Update an existing Note using: PUT "/api/auth/updatenote/:id". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    // Create a newNote object
    const updatedNote = {};
    if (title) { updatedNote.title = title; }
    if (description) { updatedNote.description = description; }
    if (tag) { updatedNote.tag = tag; }

    try {
        // Find the note to be updated
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Note not found");
        }

        // Ensure that the logged-in user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not authorized to update this note");
        }

        // Update the note
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: updatedNote }, { new: true });
        res.json(note);
    } catch (error) {
        console.error('Error updating note:', error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 4: Delete an existing Note using: DELETE "/api/auth/deletenote/:id". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Note not found");
        }

        // Ensure that the logged-in user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not authorized to delete this note");
        }

        // Delete the note
        await Notes.findByIdAndDelete(req.params.id);
        res.json({ success: "Note has been deleted" });
    } catch (error) {
        console.error('Error deleting note:', error.message);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;
