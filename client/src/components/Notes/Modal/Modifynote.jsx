import React, { useContext, useEffect } from 'react';
import NotesContext from '../../../context/Notes/NotesContext';
import { motion } from "framer-motion"
import Modalcontent from './ModifyNoteContent';


const ModifyNote = () => {

    const { toModify, editModal, setToModify, setAddNoteKey } = useContext(NotesContext);

    useEffect(() => {
        if (toModify) {
            editModal.current.showModal()
        }
    }, [toModify])

    function closeModal() {
        setAddNoteKey(new Date().getTime());
        setToModify(null)
    }

    useEffect(() => {
        console.log("Modify Modal Mounted")
    }, [])

    return <motion.dialog key={toModify?._id} ref={editModal} className="overflow-visible rounded-lg bg-transparent group" layoutId={toModify?._id}>
        <Modalcontent closeModal={closeModal} />
    </motion.dialog>
}

export default ModifyNote