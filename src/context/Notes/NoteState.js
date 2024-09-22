import React, { useState } from 'react';
import NoteContext from './noteContext';

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial);

  // Get all notes
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token') 
      },
    });

    const json = await response.json()
    console.log(json)
    setNotes(json)
  };


  // Add a Note
  const addNote = async (title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token') 
        },
        body: JSON.stringify({ title, description, tag })
      });
      const json = await response.json();
      const newNote = {
        "_id": json._id,
        "user": json.user,
        "title": title,
        "description": description,
        "tag": tag,
        "Date": new Date().toISOString(),
        "__v": 0
      };
      setNotes([...notes, newNote]);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    try {
      await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token') 
        }
      });
      const newNotes = notes.filter((note) => note._id !== id);
      setNotes(newNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token') 
        },
        body: JSON.stringify({ title, description, tag })
      });
      // eslint-disable-next-line
      const json = await response.json();
      const updatedNotes = notes.map(note =>

        note._id === id ? { ...note, title, description, tag } : note
      );
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error editing note:', error);
    }
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
