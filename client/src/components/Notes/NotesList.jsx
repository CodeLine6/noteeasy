import { useContext, useEffect, useMemo, useRef } from 'react';
import NotesContext from '../../context/Notes/NotesContext';
import NoteItem from './NoteItem';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchContext } from '../../context/SearchContext';
import { convertJSONtoHTML } from '../../lib/utils';

const NotesList = () => {
    const { notes, loading } = useContext(NotesContext);
    const { searchTerm } = useContext(SearchContext);
    const ref = useRef(null);

    const generateLoadingArray = (length) => Array.from({ length }, (_, index) => index);

    const Notes = useMemo(() => (
        notes.map(note => (
            {
                ...note,
                noteDescriptionHTML: !note.description ? '' : convertJSONtoHTML(note.description)
            }
        ))
    ), [notes])

    const filteredNotes = useMemo(() => {
        if (!searchTerm || searchTerm.includes('<') || searchTerm.includes('>')) return Notes;
        return Notes.filter(note => {
            return note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.noteDescriptionHTML.toLowerCase().includes(searchTerm.toLowerCase())
        }).map(
            note => {
                let newTitle = note.title.replace(new RegExp(searchTerm + "(?![^<]*>)", 'gi'), (match) => {
                    return `<mark style="background-color: yellow;">${match}</mark>`
                })

                const noteDescriptionHTML = note.noteDescriptionHTML.replace(new RegExp(searchTerm + "(?![^<]*>)", 'gi'), (match) => {
                    return `<mark style="background-color: yellow;">${match}</mark>`
                })
                return {
                    ...note,
                    title: newTitle,
                    noteDescriptionHTML
                }
            }
        )
    }, [searchTerm, Notes])

    const pinnedNotes = useMemo(() => (
        filteredNotes.filter(note => note.pinned)
    ), [filteredNotes])

    const rest = useMemo(() => (
        filteredNotes.filter(note => !(note.pinned))
    ), [filteredNotes])
    console.log('Notelist rendered')

    return (
        <div ref={ref} className='flex-grow overflow-x-clip'>
            {loading && <div className="container mx-auto px-5 mb-5" >
                <div className="pt-5 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" >
                    {generateLoadingArray(15).map(g => <NoteItem key={g} loading />)}
                </div>
            </div>}

            {pinnedNotes.length > 0 && <motion.div className='container mx-auto px-5 mb-5'>
                <motion.h4 initial={{ opacity: 0 }} animate={{ opacity: 1 }} >PINNED</motion.h4>
                <div className="pt-5 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" >
                    <AnimatePresence>
                        {pinnedNotes.map(note => <NoteItem note={note} key={note._id} parent={ref} />)}
                    </AnimatePresence>
                </div>
            </motion.div>}

            {rest.length > 0 && <motion.div className='container mx-auto px-5 '>
                {pinnedNotes.length > 0 && <motion.h4 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>OTHERS</motion.h4>}
                <div className="pt-5 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" >
                    <AnimatePresence>
                        {rest.map(note => <NoteItem note={note} key={note._id} parent={ref} />)}
                    </AnimatePresence>
                </div>
            </motion.div>}

        </div>
    )
}

export default NotesList
