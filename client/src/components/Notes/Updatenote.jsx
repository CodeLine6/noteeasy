import React, { useContext, useRef, useEffect, useLayoutEffect, } from 'react';
import NotesContext from '../../context/Notes/NotesContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { motion } from 'framer-motion';
import TagInput from '../UI/TagInput';

const Updatenote = ({ resetPositions, controls, exitState }) => {
    const titleInput = useRef(null);
    const descriptionInput = useRef(null);
    const tags = useRef([]);

    const { updateNote, toModify, setToModify, editModal } = useContext(NotesContext);

    useEffect(() => {
        titleInput.current.value = toModify.title;
        descriptionInput.current.innerText = toModify.description;
    }, [])

    const handleUpdate = async () => {
        updateNote(toModify._id, titleInput.current, descriptionInput.current, tags.current);
        resetPositions()
        await controls.start(exitState)
        editModal.current.close()
        queueMicrotask(() => setToModify(null))
    }

    const handleClose = async () => {
        resetPositions()
        await controls.start(exitState)
        editModal.current.close()
        queueMicrotask(() => setToModify(null))
    }

    return (
        <motion.form className='pb-10 relative' initial={{ opacity: 0 }} animate={{ opacity: 1 }} >
            <div className='max-h-96 overflow-x-auto pt-1 p-3'>
                <Input inputRef={titleInput} placeholder='Title' name='title' styleType='notes' classes="font-bold" />
                <div contentEditable="true" className='pl-3 mb-3 outline-none' ref={descriptionInput}></div>
                <TagInput initTags={toModify?.tag} customStyle="px-3" tagsValue={tags} />
            </div>
            <Button text="Close" className='rounded absolute right-24 bottom-2 px-4 py-2 hover:bg-[rgba(95,99,104,0.039)] active:bg-[rgba(95,99,104,0.161)] focus-visible:outline-none focus-visible:bg-[rgba(95,99,104,0.039)]' handleClick={handleClose} />
            <Button text="Save" className='rounded absolute right-5 bottom-2 px-4 py-2 hover:bg-[rgba(95,99,104,0.039)] active:bg-[rgba(95,99,104,0.161)] focus-visible:outline-none focus-visible:bg-[rgba(95,99,104,0.039)]' handleClick={handleUpdate} />
        </motion.form>
    )
}

export default Updatenote