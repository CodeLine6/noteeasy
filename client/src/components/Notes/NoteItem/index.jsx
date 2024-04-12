import { motion, useMotionValue, useAnimate } from 'framer-motion';
import ToggleNotePinned from '../ToggleNotePinned';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { v4 as uuid } from 'uuid';
import Noteactions from './Noteactions';
import NotesContext from '../../../context/Notes/NotesContext';
import { ModalContext } from '../../../context/Modal/ModalContext';
import { useContext } from 'react';

const NoteItem = ({ note, loading, parent }) => {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const { setToModify, duplicateNote } = useContext(NotesContext);
    const { setModifyComponent, modifyComponent } = useContext(ModalContext)
    const [scope, animate] = useAnimate()

    const modifyObj = () => {
        return {
            ...note,
            noteEl: scope.current,
            animate,
            notePositions: {
                translatedX: x.current,
                translatedY: y.current
            }
        }
    }

    const handleDoubleClick = (e) => {
        // check if element is double clicked
        if (e.detail === 2) {
            setToModify(modifyObj())
            modifyComponent === 'addCollaborator' && setModifyComponent('update')
        }

    }

    { typeof note.title === 'string' && console.log(`Note Item : ${note.title}`) }

    return (
        <motion.div className='w-full sm:w-1/2 md:w-1/4 lg:w-1/5 p-1 group box-border' layoutId={note.lId || note._id} layout exit={{ scale: 0 }} >
            <motion.div onClick={handleDoubleClick} ref={scope} style={{ x, y, opacity: note.pending ? 0.4 : 1 }} drag dragConstraints={parent} dragElastic={0.1} whileDrag={{ scale: 1.1 }} className="w-full border border-[#e0e0e0] rounded-md overflow-hidden bg-white" >
                <div className="relative px-3">
                    <ToggleNotePinned className="group-hover:block" noteId={note._id} isPinned={note.pinned} />
                    <Notebody note={note}>
                        <Noteactions modifyObj={modifyObj} loading={loading} />
                    </Notebody>
                </div>
            </motion.div>
        </motion.div>

    )
}

const Notebody = ({ note, children }) => {
    return (
        <>
            <div className='cursor-pointer'>
                {note.title || note.description ?
                    <>
                        <h5 className="card-title pt-3 max-w-[90%] max-h-13 overflow-hidden text-ellipsis font-bold" style={{ display: '-webkit-box', '-webkit-box-orient': 'vertical', '-webkit-line-clamp': '2' }}>{note.title}</h5>
                        <p className="card-text pt-3 max-h-20 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', '-webkit-box-orient': 'vertical', '-webkit-line-clamp': '3' }}>{note.description}</p>
                    </>
                    : <p className="card-text py-3">Empty Note</p>
                }
            </div>
            <div className='flex gap-1 flex-wrap mt-4'>
                {note.tag.map((tag, idx) => (
                    <a className="px-3 py-1 rounded-md bg-slate-200 text-xs font-semibold" key={tag + idx}>{tag}</a>
                ))}
            </div>
            {children}
        </>
    )
}

NoteItem.defaultProps = {
    note: {
        _id: uuid(),
        title: <Skeleton />,
        description: <Skeleton />,
        tag: [<Skeleton width={30} />]
    }
}

export default NoteItem
