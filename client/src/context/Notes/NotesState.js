import React, { useContext, useState, useRef, useEffect, useCallback } from "react";
import NotesContext from "./NotesContext";
import AlertContext from "../Alert/AlertContext";
import { v4 as uuid } from 'uuid';

const NotesState = (props) => {
  const API_HOST = process.env.REACT_APP_API_HOST;
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toModify, setToModify] = useState(null);
  const editModal = useRef(null);
  const setAlerts = useContext(AlertContext);

  useEffect(() => {
    getNotes().then(d => {
      setNotes(d)
      setLoading(false)
    });
  }, []);

  // Fetch Notes
  const getNotes = async () => {
    const response = await fetch(`${API_HOST}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem('authToken'),
        "Content-Type": "application/json"
      }
    });

    if (!(response.ok)) {
      return;
    }

    return await response.json();
  };

  // Add a note
  const addNote = useCallback((title, description, tag) => {
    const lId = uuid();
    const tempNewNote = {
      title, description, tag, pinned: false, _id: null, lId, pending: true
    };

    setNotes(prevNotes => [...prevNotes, tempNewNote]);

    fetch(`${API_HOST}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem('authToken'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "title": title,
        "description": description,
        "tag": tag
      }),
    }).then(r => {
      if (r.ok) {
        r.json().then(data => {
          setNotes(prev => prev.slice(0, -1).concat({ ...data, lId }));
          setAlerts({ type: "success", message: "Note Added" });
        });
      } else {
        setNotes(prev => prev.slice(0, -1));
        r.json().then(data => {
          setAlerts({ type: "error", message: data.message });
        });
      }
    }).catch(e => {
      setNotes(prev => prev.slice(0, -1));
      setAlerts({ type: "error", message: "Something went wrong. Please try again" });
    });
  }, []);

  // Delete a note
  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note._id !== id);
    setNotes(updatedNotes);

    fetch(`${API_HOST}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "auth-token": localStorage.getItem('authToken'),
        "Content-Type": "application/json"
      },
    })
    .then(async (response) => {
      if (response.ok) {
        setAlerts({ type: "success", message: "Note Deleted" });
      } else {
        throw await response.json();
      }
    })
    .catch((error) => {
      setNotes([...notes]); // Revert changes
      setAlerts({ type: "error", message: error.message || "Something went wrong. Please try again." });
    });
  }

  // Update a note
  const updateNote = (id, titleInput, descriptionInput, tagInput) => {
    const updatedNotes = notes.map((note) => {
      return note._id === id
        ? {
            ...note,
            title : titleInput.value,
            description: descriptionInput,
            tag: tagInput
          }
        : note;
    });
    setNotes(updatedNotes);

    fetch(`${API_HOST}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "auth-token": localStorage.getItem('authToken'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "title": titleInput.value,
        "description": descriptionInput,
        "tag": tagInput
      }),
    })
    .then(async (response) => {
      if (response.ok) {
        setAlerts({ type: "success", message: "Note Updated" });
      } else {
        throw await response.json();
      }
    })
    .catch((error) => {
      setNotes([...notes]); // Revert changes
      setAlerts({ type: "error", message: error.message || "Something went wrong. Please try again." });
    });
  }

  //Duplicate a Note
  const duplicateNote = (noteId) => {
    const noteToDuplicate = notes.find(note => note._id === noteId);
    if (!noteToDuplicate) return;

    const lId = uuid();
    const tempNewNote = {
      title: noteToDuplicate.title,
      description: noteToDuplicate.description,
      tag: noteToDuplicate.tag,
      pinned: false,
      _id: null,
      lId,
      pending: true
    };

    setNotes(prevNotes => [...prevNotes, tempNewNote]);

    fetch(`${API_HOST}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem('authToken'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "title": noteToDuplicate.title,
        "description": noteToDuplicate.description,
        "tag": noteToDuplicate.tag
      }),
    }).then(r => {
      if (r.ok) {
        r.json().then(data => {
          setNotes(prevNotes => prevNotes.map(note => (note.lId === lId ? { ...data, lId } : note)));
          setAlerts({ type: "success", message: "Note Added" });
        });
      } else {
        setNotes(prevNotes => prevNotes.filter(note => note.lId !== lId));
        r.json().then(data => {
          setAlerts({ type: "error", message: data.message });
        });
      }
    }).catch(e => {
      setNotes(prevNotes => prevNotes.filter(note => note.lId !== lId));
      setAlerts({ type: "error", message: "Something went wrong. Please try again" });
    });
  }

  // Toggle Note Pinned
  const toggleNotePinned = async (noteId, pinned, revert) => {
    setNotes(prevNotes => (
      prevNotes.map(note => note._id === noteId ? { ...note, pinned } : note)
    ));

    fetch(`${API_HOST}/api/notes/togglepin/${noteId}`, {
      method: "PUT",
      headers: {
        "auth-token": localStorage.getItem('authToken'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        isPinned: pinned
      }),
    })
    .then(r => {
      if (!(r.ok)) {
        revert();
      }
    })
    .catch(e => {
      revert();
    });
  }

  //add a collaborator
  const addCollaborator = async (inputRef) => {
    fetch(`${API_HOST}/api/notes/addcollaborator/${toModify._id}`, {
        method: "PATCH",
        headers: {
            "auth-token": localStorage.getItem('authToken'),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            collaboratorEmail: inputRef.current.value
        })
    }).then(res => res.json()).then(data => {
      const updatedNotes = notes.map((note) => {
        return note._id === data._id
          ? {...data}: note;
      });
      setNotes(updatedNotes);
    }).catch(e => {

    })
  
}

  return (
    <NotesContext.Provider value={{ notes, toModify, editModal, loading, getNotes,addNote, deleteNote, updateNote, setToModify, duplicateNote, toggleNotePinned, addCollaborator }}>
    {props.children}
  </NotesContext.Provider>
);
}

export default NotesState;

