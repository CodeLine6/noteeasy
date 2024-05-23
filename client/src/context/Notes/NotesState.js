import React, { useState, useRef, useEffect, useCallback } from "react";
import NotesContext from "./NotesContext";
import { v4 as uuid } from 'uuid';
import { toast } from "sonner";

const NotesState = (props) => {
  const API_HOST = process.env.REACT_APP_API_HOST;
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toModify, setToModify] = useState(null);
  const editModal = useRef(null);

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
  const addNote = (title, description, tag) => {
    const lId = uuid();
    const tempNewNote = {
      title, description, tag, pinned: false, _id: null, lId, pending: true
    };

    setNotes(prevNotes => [...prevNotes, tempNewNote]);

    const addNoteRequest = fetch(`${API_HOST}/api/notes/addnote`, {
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
    })

    return new Promise((resolve, reject) => {
      toast.promise(
        addNoteRequest.then(async r => {
          if (r.ok) {
            const newNote = await r.json();
            setNotes(prev => prev.slice(0, -1).concat({ ...newNote, lId }));
            resolve();
          } else throw new Error("Failed to Add Note. Please try again.");

        }).catch(e => {
          resolve()
          throw new Error("Failed to Add Note. Please try again.");
        }),
        {
          loading: "Adding Note...",
          success: "Note Added Successfully",
          error: (e) => {
            setNotes(prev => prev.slice(0, -1));
            reject(e);
            return e.message;
          }
        }
      )
    })
  }

  // Delete a note
  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note._id !== id);
    setNotes(updatedNotes);

    const deleteRequest = fetch(`${API_HOST}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "auth-token": localStorage.getItem('authToken'),
        "Content-Type": "application/json"
      },
    });

    return new Promise((resolve, reject) => {
      toast.promise(
        deleteRequest.then(async (res) => {
          if (res.ok) {
            resolve();
          } else {
            throw new Error("Failed to Delete Note. Please try again.");
          }
        }).catch(e => {
          resolve()
          throw new Error("Failed to Delete Note. Please try again.");
        }),
        {
          loading: "Deleting Note...",
          success: "Note Deleted Successfully",
          error: (e) => {
            setNotes([...notes]); // Revert changes
            reject(e);
            return e.message;
          },
        }
      )
    })
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

    const updateRequest = fetch(`${API_HOST}/api/notes/updatenote/${id}`, {
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

    return new Promise((resolve, reject) => {
      toast.promise(
        updateRequest.then(async (res) => {
          if (res.ok) {
            resolve();
          } else {
            throw new Error("Failed to Update Note. Please try again.");
          }
        }).catch(e => {
          resolve()
          throw new Error("Failed to Update Note. Please try again.");
        }),
        {
          loading: "Updating Note...",
          success: "Note Updated Successfully",
          error: (e) => {
            setNotes([...notes]); // Revert changes
            reject(e);
            return e.message;
          },
        }
      )
    })
  }

  //Duplicate a Note
  const duplicateNote = (noteId) => {
    const noteToDuplicate = notes.find(note => note._id === noteId);
    if (!noteToDuplicate) return;

    const tempNewNote = {
      title: noteToDuplicate.title,
      description: noteToDuplicate.description,
      tag: noteToDuplicate.tag,
      pinned: false,
      _id: null,
      pending: true
    };

    setNotes(prevNotes => [...prevNotes, tempNewNote]);

    const duplicateNoteRequest = fetch(`${API_HOST}/api/notes/addnote`, {
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
    });

    return new Promise((resolve, reject) => {
      toast.promise(
        duplicateNoteRequest.then(async r => {
          if (r.ok) {
            const newNote = await r.json();
            setNotes(prev => prev.slice(0, -1).concat(newNote));
            resolve();
          } else throw new Error("Failed to Duplicate Note. Please try again.");
        }).catch(e => {
          resolve()
          throw new Error("Failed to Duplicate Note. Please try again.");
        }),
        {
          loading: "Duplicating Note...",
          success: "Note Duplicated Successfully",
          error: (e) => {
            setNotes(prev => prev.slice(0, -1));
            reject(e);
            return e.message;
          },      
        })
    })
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

