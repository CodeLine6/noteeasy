import React, { useContext, useEffect, useRef } from 'react'
import { ModalContext } from '../../../context/Modal/ModalContext'
import Updatenote from '../Updatenote'
import Addcollaborator from '../Addcollaborator'
import { useAnimationControls, motion } from 'framer-motion'
import NotesContext from '../../../context/Notes/NotesContext'

const Modalcontent = ({ closeModalAnimation }) => {

    const { modifyComponent } = useContext(ModalContext)
    const { toModify } = useContext(NotesContext);
    const controls = useAnimationControls()
    const divRef = useRef(null)
    const heightRef = useRef(0)

    useEffect(() => {
        if (toModify)
            setTimeout(() => {
                if (heightRef.current) {
                    controls.set({ scaleY: heightRef.current / divRef.current.offsetHeight })
                    controls.start({ scaleY: 1 })
                }
                heightRef.current = divRef.current.offsetHeight
            }, 50);
    }, [modifyComponent, toModify])

    useEffect(() => {
        console.log('Modal content mounted')
    }, [])

    return (
        <>
            {toModify && <motion.div ref={divRef} className="rounded-lg bg-white w-[600px] relative" style={{ transformOrigin: "top left" }} animate={controls}>
                {modifyComponent === 'update' ? <Updatenote closeModalAnimation={closeModalAnimation} /> : <Addcollaborator key={toModify._id} />}
            </motion.div>}
        </>
    )
}

export default Modalcontent