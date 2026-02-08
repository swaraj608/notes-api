const express = require('express');
const fs = require('fs'); // The File System module
const app = express();
const PORT = 3000;
const DATA_FILE = './notes.json';

app.use(express.json());

// Helper Function: Read data from the file
const readNotes = () => {
    if (!fs.existsSync(DATA_FILE)) return []; // If file doesn't exist, return empty array
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// Helper Function: Write data to the file
const writeNotes = (notes) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2)); // 'null, 2' makes the JSON readable
};

// --- ROUTES ---

// 1. GET ALL
app.get('/notes', (req, res) => {
    const notes = readNotes();
    res.json(notes);
});

// 2. CREATE
app.post('/notes', (req, res) => {
    const notes = readNotes();
    const newNote = {
        id: Date.now(), // Use timestamp as a unique ID
        title: req.body.title,
        content: req.body.content
    };
    notes.push(newNote);
    writeNotes(notes);
    res.status(201).json(newNote);
});

// 3. DELETE
app.delete('/notes/:id', (req, res) => {
    let notes = readNotes();
    const noteId = Number(req.params.id);
    notes = notes.filter(n => n.id !== noteId);
    writeNotes(notes);
    res.json({ message: "Note deleted and file updated!" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});