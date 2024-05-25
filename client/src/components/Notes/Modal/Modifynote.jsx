import React, { useContext, useEffect, useMemo, useState } from 'react';
import NotesContext from '../../../context/Notes/NotesContext';
import useModifyModal from '../../../Hooks/useModifyModal';
import { motion } from "framer-motion"
import Modalcontent from './Modalcontent';


const ModifyNote = () => {

    const { toModify, editModal, setToModify, setAddNoteKey } = useContext(NotesContext);

    useEffect(() => {
        if (toModify) {
            editModal.current.showModal()
        }
    }, [toModify])

    const [controls, exitState, resetPositions] = useModifyModal();

    const handleEscape = async (e) => {
        if (e['code'] === 'Escape') {
            e.preventDefault();
            closeModal()
        }
    }

    function closeModal() {
        setAddNoteKey(new Date().getTime());
        setTimeout(async () => {
            resetPositions()
            await controls.start(exitState)
            editModal.current.close()
            setToModify(null)
        }, 100)
    }

    useEffect(() => {
        console.log("Modify Modal Mounted")
    }, [])

    return <motion.dialog key={toModify?._id} ref={editModal} className="overflow-visible rounded-lg opacity-0 mt-[20vh] bg-transparent group" animate={controls} exit={exitState} onKeyDown={handleEscape}>
        <Modalcontent closeModalAnimation={closeModal} />
    </motion.dialog>
}

export default ModifyNote