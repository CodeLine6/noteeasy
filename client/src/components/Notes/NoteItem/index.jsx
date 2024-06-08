import { motion, useMotionValue, useAnimate } from 'framer-motion';
import ToggleNotePinned from '../ToggleNotePinned';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { v4 as uuid } from 'uuid';
import Noteactions from './Noteactions';
import NotesContext from '../../../context/Notes/NotesContext';
import { ModalContext } from '../../../context/Modal/ModalContext';
import { useContext } from 'react';

const NoteItem = ({ note, loading }) => {

    const { setToModify } = useContext(NotesContext);
    const { setModifyComponent } = useContext(ModalContext)



    const handleDoubleClick = (e) => {
        // check if element is double clicked
        if (e.detail === 2) {
            setToModify(note)
            setModifyComponent('update')
        }

    }

    { typeof note.title === 'string' && console.log(`Note Item : ${note.title}`) }

    return (
        <motion.div onClick={handleDoubleClick} style={{ opacity: note.pending ? 0.4 : 1 }} className="group w-full border border-[#e0e0e0] rounded-md overflow-hidden bg-white" layout layoutId={note._id}>
            <div className="relative px-3 h-full flex flex-col">
                <ToggleNotePinned className="group-hover:block" noteId={note._id} isPinned={note.pinned} />
                <Notebody note={note} loading={loading}>
                    <Noteactions note={note} loading={loading} />
                </Notebody>
            </div>
        </motion.div>

    )
}

const Notebody = ({ note, children, loading }) => {
    return (
        <>
            <div className='cursor-pointer flex-grow'>
                {loading ? <Skeleton className='mt-2' count={2} /> :
                    note.title || note.noteDescriptionHTML.replace("<p></p>", "").length ?
                        <>
                            <h5 className="card-title pt-3 max-w-[90%] max-h-13 overflow-hidden text-ellipsis font-bold" style={{ display: '-webkit-box', 'WebkitBoxOrient': 'vertical', 'WebkitLineClamp': '2' }}>{note.title}</h5>
                            <p className="card-text pt-3 max-h-20 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', 'WebkitBoxOrient': 'vertical', 'WebkitLineClamp': '3' }} dangerouslySetInnerHTML={{ __html: note.noteDescriptionHTML }} />
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

        tag: [<Skeleton width={30} />]
    }
}

export default NoteItem
