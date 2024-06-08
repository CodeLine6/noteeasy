import React, { useContext, useEffect } from 'react';
import NotesContext from '../../../context/Notes/NotesContext';
import { motion } from "framer-motion"
import Modalcontent from './Modalcontent';


const ModifyNote = () => {

    const { toModify, editModal, setToModify, setAddNoteKey } = useContext(NotesContext);

    useEffect(() => {
        if (toModify) {
            editModal.current.showModal()
        }
    }, [toModify])


    const handleEscape = async (e) => {
        if (e['code'] === 'Escape') {
            e.preventDefault();
            closeModal()
        }
    }

    function closeModal() {
        setAddNoteKey(new Date().getTime());

        //editModal.current.close()
        setToModify(null)

    }

    useEffect(() => {
        console.log("Modify Modal Mounted")
    }, [])

    return <motion.dialog key={toModify?._id} ref={editModal} className="overflow-visible rounded-lg mt-[20vh] bg-transparent group" onKeyDown={handleEscape} layoutId={toModify?._id}>
        <Modalcontent closeModal={closeModal} />
    </motion.dialog>
}

export default ModifyNote