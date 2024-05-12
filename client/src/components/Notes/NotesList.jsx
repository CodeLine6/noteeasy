import { useContext, useEffect, useMemo, useRef } from 'react';
import NotesContext from '../../context/Notes/NotesContext';
import NoteItem from './NoteItem';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchContext } from '../../context/SearchContext';
import { Editor } from 'novel-lightweight';
import TailwindEditor from '../Editor/Editor';


const NotesList = () => {
    const { notes, loading } = useContext(NotesContext);
    const { searchTerm } = useContext(SearchContext);
    const ref = useRef(null);

    const generateLoadingArray = (length) => Array.from({ length }, (_, index) => index);

    const filteredNotes = useMemo(() => {
        if (!searchTerm || searchTerm.includes('<') || searchTerm.includes('>')) return notes;
        return notes.filter(note => note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.description.toLowerCase().includes(searchTerm.toLowerCase())).map(
            note => {
                // look for searchterm in text which is not between < and >

                let newTitle = note.title.replace(new RegExp(searchTerm + "(?![^<]*>)", 'gi'), (match) => {
                    return `<mark style="background-color: yellow;">${match}</mark>`
                })


                let newDescription = note.description.replace(new RegExp(searchTerm + "(?![^<]*>)", 'gi'), (match) => {
                    return `<mark style="background-color: yellow;">${match}</mark>`
                })
                return {
                    ...note,
                    title: newTitle,
                    description: newDescription
                }
            }
        )
    }, [searchTerm, notes])

    const pinnedNotes = useMemo(() => (
        filteredNotes.filter(note => note.pinned)
    ), [filteredNotes])

    const rest = useMemo(() => (
        filteredNotes.filter(note => !(note.pinned))
    ), [filteredNotes])
    console.log('Notelist rendered')

    return (
        <div ref={ref} className='flex-grow overflow-x-clip'>
            {loading && <div className="container mx-auto px-5 pt-5 flex flex-wrap items-start content-baseline flex-grow" >
                {generateLoadingArray(15).map(g => <NoteItem key={g} loading />)}
            </div>}

            {pinnedNotes.length > 0 && <motion.div className='container mx-auto px-5 mb-5'>
                <motion.h4 initial={{ opacity: 0 }} animate={{ opacity: 1 }} >PINNED</motion.h4>
                <div className="pt-5 flex flex-wrap items-start content-baseline flex-grow" >
                    <AnimatePresence>
                        {pinnedNotes.map(note => <NoteItem note={note} key={note._id} parent={ref} />)}
                    </AnimatePresence>
                </div>
            </motion.div>}

            {rest.length > 0 && <motion.div className='container mx-auto px-5 '>
                {pinnedNotes.length > 0 && <motion.h4 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>OTHERS</motion.h4>}
                <div className="pt-5 flex flex-wrap items-start content-baseline flex-grow" >
                    <AnimatePresence>
                        {rest.map(note => <NoteItem note={note} key={note._id} parent={ref} />)}
                    </AnimatePresence>
                </div>
            </motion.div>}

        </div>
    )
}

export default NotesList
