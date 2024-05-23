import React, { useContext, useEffect, useMemo, useState } from 'react';
import NotesContext from '../../../context/Notes/NotesContext';
import { AnimatePresence } from 'framer-motion';
import useModifyModal from '../../../Hooks/useModifyModal';
import useModal from '../../../Hooks/useModal';
import { motion } from "framer-motion"
import Modalcontent from './Modalcontent';


const ModifyNote = () => {

    const { toModify, editModal, setToModify } = useContext(NotesContext);

    useEffect(() => {
        if (toModify) {
            editModal.current.showModal()
        }
    }, [toModify])

    const [controls, exitState, resetPositions] = useModifyModal();

    const handleEscape = async (e) => {
        if (e['code'] === 'Escape') {
            e.preventDefault();
            resetPositions()
            await controls.start(exitState)
            editModal.current.close()
            setToModify(null)
        }
    }

    useEffect(() => {
        console.log("Modify Modal Mounted")
        return () => console.log("Modify Modal unmounted")
    }, [])

    return <motion.dialog key={toModify?._id} ref={editModal} className="overflow-visible rounded-lg opacity-0 mt-[20vh] bg-transparent group" animate={controls} exit={exitState} onKeyDown={handleEscape}>
        <Modalcontent resetPositions={resetPositions} modalControls={controls} exitState={exitState} />
    </motion.dialog>
}

export default ModifyNote