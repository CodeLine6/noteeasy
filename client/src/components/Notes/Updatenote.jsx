import React, { useContext, useRef, useEffect } from 'react';
import NotesContext from '../../context/Notes/NotesContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { motion } from 'framer-motion';
import TagInput from '../UI/TagInput';
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import HardBreak from '@tiptap/extension-hard-break'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Blockquote from '@tiptap/extension-blockquote'

// Option 1: Browser + server-side
import { generateJSON } from '@tiptap/html'
import TailwindEditor from '../Editor/Editor';

const extensions = [
    Document, Paragraph, Text, Bold, Heading, BulletList, ListItem, OrderedList, Italic, Link, Underline, Strike, Code, CodeBlock, HardBreak, Highlight, TaskItem, TaskList, Blockquote
]

const Updatenote = ({ resetPositions, controls, exitState }) => {
    const titleInput = useRef(null);
    const tags = useRef([]);

    const { updateNote, toModify, setToModify, editModal } = useContext(NotesContext);
    const description = useRef(generateJSON(toModify.description.replace(/<mark[^>]*>|<\/mark>/g, ''), extensions));

    useEffect(() => {
        titleInput.current.value = toModify.title.replace(/<mark[^>]*>|<\/mark>/g, '');
    }, [])

    const handleUpdate = async () => {
        updateNote(toModify._id, titleInput.current, description.current, tags.current);
        resetPositions()
        await controls.start(exitState)
        editModal.current.close()
        setToModify(null)
    }

    const handleClose = async () => {
        resetPositions()
        await controls.start(exitState)
        editModal.current.close()
        setToModify(null)
    }

    return (
        <motion.form className='pb-10 relative' initial={{ opacity: 0 }} animate={{ opacity: 1 }} >
            <div className='max-h-96 overflow-x-auto pt-1 p-3'>
                <Input inputRef={titleInput} placeholder='Title' name='title' styleType='notes' classes="font-bold" />
                <TailwindEditor initialContent={description.current} setContent={description} />
                <TagInput initTags={toModify?.tag} customStyle="px-3" tagsValue={tags} />
            </div>
            <Button text="Close" className='rounded absolute right-24 bottom-2 px-4 py-2 hover:bg-[rgba(95,99,104,0.039)] active:bg-[rgba(95,99,104,0.161)] focus-visible:outline-none focus-visible:bg-[rgba(95,99,104,0.039)]' handleClick={handleClose} />
            <Button text="Save" className='rounded absolute right-5 bottom-2 px-4 py-2 hover:bg-[rgba(95,99,104,0.039)] active:bg-[rgba(95,99,104,0.161)] focus-visible:outline-none focus-visible:bg-[rgba(95,99,104,0.039)]' handleClick={handleUpdate} />
        </motion.form>
    )
}

export default Updatenote