import { useContext } from 'react'
import NotesContext from '../../../context/Notes/NotesContext';
import Skeleton from 'react-loading-skeleton'
import { IoCopyOutline } from "react-icons/io5";
import { VscEdit, VscTrash } from "react-icons/vsc";
import { FiUserPlus } from "react-icons/fi";
import { ModalContext } from '../../../context/Modal/ModalContext';

const Noteactions = ({ note, loading }) => {
    const { deleteNote, setToModify, duplicateNote } = useContext(NotesContext);
    const { setModifyComponent, modifyComponent } = useContext(ModalContext)

    return (
        <div className='w-full opacity-0 group-hover:opacity-100 transition text-lg text-slate-800 flex justify-end py-2 pr-2'>
            <Actionbutton loading={loading} Icon={VscEdit} handler={() => {
                setToModify(note)
                modifyComponent === 'addCollaborator' && setModifyComponent('update')
            }} />
            <Actionbutton loading={loading} Icon={FiUserPlus} handler={() => {
                setToModify(note)
                setModifyComponent('addCollaborator')
            }} />
            <Actionbutton loading={loading} Icon={IoCopyOutline} handler={() => duplicateNote(note._id)} />
            <Actionbutton loading={loading} Icon={VscTrash} handler={() => deleteNote(note._id)} />
        </div>
    )
}

const Actionbutton = ({ loading, Icon, handler }) => {
    if (loading)
        return <Skeleton width={30} containerClassName="mx-2" />

    return <button className="p-2 rounded-full hover:bg-gray-200" onClick={handler}><Icon /></button>
}

export default Noteactions