import { useContext, useEffect, useRef } from 'react';
import NotesContext from '../context/Notes/NotesContext';
import { useAnimationControls } from 'framer-motion';

const useModifyModal = () => {

    const controls = useAnimationControls()
    const { toModify, editModal } = useContext(NotesContext);
    const widthRatio = useRef(0);
    const heightRatio = useRef(0);
    const leftDifference = useRef(0);
    const topDifference = useRef(0);

    const resetPositions = () => {
        toModify.animate(toModify.noteEl, {
            scaleX: 1,
            scaleY: 1,
            x: toModify.notePositions.translatedX,
            y: toModify.notePositions.translatedY,
            opacity: 1,
        }, { type: "Inertia", })
    }

    const exitState = () => ({
        scaleX: 1 / widthRatio.current,
        scaleY: 1 / heightRatio.current,
        x: -(leftDifference.current - toModify.notePositions.translatedX),
        y: -(topDifference.current - toModify.notePositions.translatedY),
        opacity: 0,
        transition: {
            type: "Inertia",
        }
    })

    useEffect(() => {
        if (toModify) {
            setTimeout(() => {
                widthRatio.current = editModal.current.offsetWidth / toModify.noteEl.offsetWidth;
                heightRatio.current = editModal.current.offsetHeight / toModify.noteEl.offsetHeight;

                const initialX = toModify.noteEl.getBoundingClientRect().left - toModify.notePositions.translatedX
                const initialY = toModify.noteEl.getBoundingClientRect().top - toModify.notePositions.translatedY

                leftDifference.current = editModal.current.getBoundingClientRect().left - initialX;
                topDifference.current = editModal.current.getBoundingClientRect().top - initialY;

                controls.set(exitState)

                toModify.animate(toModify.noteEl, {
                    scaleX: widthRatio.current,
                    scaleY: heightRatio.current,
                    x: leftDifference.current,
                    y: topDifference.current,
                    opacity: 0,
                    transformOrigin: "top left",
                }, { type: "Inertia" })

                controls.start({
                    x: 0,
                    y: 0,
                    scaleX: 1,
                    scaleY: 1,
                    opacity: 1,
                    transformOrigin: "top left",
                    transition: {
                        type: "Inertia"
                    }
                });
            }, 40)
        }
    }, [toModify])

    return [controls, exitState, resetPositions]
}

export default useModifyModal