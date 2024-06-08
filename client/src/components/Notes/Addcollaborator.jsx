import React, { useContext, useRef, useState } from 'react'
import UserListItem from '../UserListItem'
import Button from '../UI/Button'
import NotesContext from '../../context/Notes/NotesContext'
import { useAuth } from '../../context/authContext'

const Addcollaborator = ({ closeModal }) => {

    const { toModify, addCollaborator } = useContext(NotesContext);
    const inputRef = useRef()

    const handleSave = () => {
        addCollaborator(inputRef)
        closeModal()
    }
    const { user: currUser } = useAuth()

    const isCurrentUserNoteOwner = currUser._id === toModify?.user?._id
    return (
        <div className='p-5 pb-20 relative' key={toModify._id}  >
            <h1 className='font-semibold pb-2'>Collaborators</h1>
            <hr className='pt-2' />
            <UserListItem user={toModify.user} isOwner />
            {toModify.collaborators.map(collaborator => {
                const canBeRemoved = isCurrentUserNoteOwner || collaborator._id === currUser._id
                return <UserListItem user={collaborator} canBeRemoved={canBeRemoved} />
            })}
            <UserListItem addUser inputRef={inputRef} />
            <Button text="Close" className='rounded absolute right-24 bottom-2 px-4 py-2 hover:bg-[rgba(95,99,104,0.039)] active:bg-[rgba(95,99,104,0.161)] focus-visible:outline-none focus-visible:bg-[rgba(95,99,104,0.039)]' onClick={closeModal} />
            <Button text="Save" className='rounded absolute right-5 bottom-2 px-4 py-2 hover:bg-[rgba(95,99,104,0.039)] active:bg-[rgba(95,99,104,0.161)] focus-visible:outline-none focus-visible:bg-[rgba(95,99,104,0.039)]' onClick={handleSave} />
        </div>
    )
}

export default Addcollaborator