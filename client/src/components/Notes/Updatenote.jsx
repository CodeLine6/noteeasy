import React, { useContext, useRef, useEffect } from 'react';
import NotesContext from '../../context/Notes/NotesContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { motion } from 'framer-motion';
import TagInput from '../UI/TagInput';

import TailwindEditor from '../Editor/Editor';

const Updatenote = ({ closeModalAnimation }) => {
    const titleInput = useRef(null);
    const formRef = useRef(null);

    const { updateNote, toModify } = useContext(NotesContext);
    const tags = useRef(toModify?.tag || []);
    const description = useRef(toModify.description);

    useEffect(() => {
        titleInput.current.value = toModify.title.replace(/<mark[^>]*>|<\/mark>/g, '');
    }, [])

    const handleUpdate = async () => {
        updateNote(toModify._id, titleInput.current, description.current, tags.current);
        closeModalAnimation()
    }

    const handleClose = async () => {
        closeModalAnimation()
    }

    return (
        <motion.form className='pb-10 relative' initial={{ opacity: 0 }} animate={{ opacity: 1 }} ref={formRef}>
            <div className='max-h-96 overflow-x-auto pt-1 p-3'>
                <Input inputRef={titleInput} placeholder='Title' name='title' styleType='notes' classes="font-bold" />
                <TailwindEditor key={toModify.id} initialContent={description.current} content={description} parent={formRef} />
                <TagInput customStyle="px-3" tagsValue={tags} />
            </div>
            <Button text="Close" className='rounded absolute right-24 bottom-2 px-4 py-2 hover:bg-[rgba(95,99,104,0.039)] active:bg-[rgba(95,99,104,0.161)] focus-visible:outline-none focus-visible:bg-[rgba(95,99,104,0.039)]' handleClick={handleClose} />
            <Button text="Save" className='rounded absolute right-5 bottom-2 px-4 py-2 hover:bg-[rgba(95,99,104,0.039)] active:bg-[rgba(95,99,104,0.161)] focus-visible:outline-none focus-visible:bg-[rgba(95,99,104,0.039)]' handleClick={handleUpdate} />
        </motion.form>
    )
}

export default Updatenote