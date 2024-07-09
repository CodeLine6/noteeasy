const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchuser');
const getnotes = require('../controllers/notes/getnotes');
const addnote = require('../controllers/notes/addnote');
const updatenote = require('../controllers/notes/updatenote');
const pinnote = require('../controllers/notes/pinnote');
const addnotecollaborator = require('../controllers/notes/addnotecollaborator');
const deletenote = require('../controllers/notes/deletenote');
const removenotecollaborator = require('../controllers/notes/removenotecollaborator');
const fetchNoteState = require('../controllers/notes/fetchNoteState');
const restoreNoteVersion = require('../controllers/notes/restoreNoteVersion');

// ROUTE 1: Get all notes using: GET "/api/notes" . Login required

router.get('/fetchallnotes', fetchUser, getnotes)

// ROUTE 2: Add a new note using: POST "/api/notes/addnote" . Login required

router.post('/addnote', fetchUser, addnote)

// ROUTE 3: Update existing note using: PUT "/api/notes/updatenote" . Login required

router.put('/updatenote/:id', fetchUser, updatenote);

router.put('/togglepin/:id', fetchUser, pinnote);

// ROUTE 4: Add collaborator to note using: PATCH "api/notes/addcollaborator/{note_id}" . Login required

router.patch('/addcollaborator/:id',fetchUser, addnotecollaborator)

// ROUTE 5: Remove collaborator to note using: PATCH "api/notes/removecollaborator/{note_id}" . Login required

router.patch('/removecollaborator/:id',fetchUser, removenotecollaborator)

// ROUTE 6: Delete existing note using: DELETE "/api/notes/deletenote" . Login required

router.delete('/deletenote/:id', fetchUser, deletenote);

// ROUTE 7 Get Note Details using GET "/api/notes/state/{note_id}" . Login required

router.get('/state/:id', fetchUser, fetchNoteState)

router.get('/:id/restore-version/:version', fetchUser, restoreNoteVersion)

module.exports = router