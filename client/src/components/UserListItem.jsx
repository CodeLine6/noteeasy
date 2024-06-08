import { FiUserPlus } from "react-icons/fi";
import Input from "./UI/Input";
import { RxCross1 } from "react-icons/rx";
import { useContext } from "react";
import NotesContext from "../context/Notes/NotesContext";

const UserListItem = ({ user, addUser, inputRef, isOwner, canBeRemoved }) => {
    const { removeCollaborator } = useContext(NotesContext)

    return (
        <div className='grid items-center mb-2' style={{ gridTemplateColumns: `${addUser ? '40' : '50'}px auto` }}>
            <avatar className={`w-10 h-10 rounded-full flex justify-center items-center border-2 shadow-md ${addUser ? 'border-gray-400 text-gray-600' : 'bg-slate-400 text-white border-white'}`}>{addUser ? <FiUserPlus /> : user.name?.[0]}</avatar>
            {addUser ?
                <Input inputRef={inputRef} name="Collaborator" inputType="email" placeholder="Email to share with" styleType="notes" /> :
                (<div className="flex justify-between items-center">
                    <div>
                        <p><span className='font-bold'>{user.name}</span>{isOwner && " (Owner)"}</p>
                        <p className='text-gray-600'>{user.email}</p>
                    </div>
                    {canBeRemoved && <button className='p-2 rounded-full hover:bg-gray-200' onClick={() => removeCollaborator(user._id)}><RxCross1 /></button>}
                </div>)
            }
        </div >

    )
}

export default UserListItem