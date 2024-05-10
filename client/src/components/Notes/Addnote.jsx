import React, { useContext, useRef, useEffect, useState } from 'react';
import NotesContext from '../../context/Notes/NotesContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import TagInput from '../UI/TagInput';
import { useEditor } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Heading from '@tiptap/extension-heading'
import TailwindEditor from '../Editor/Editor';


const Addnote = React.memo(({ children, ...props }) => {
    const { addNote } = useContext(NotesContext);

    const formRef = useRef(null);
    const titleInputRef = useRef(null);
    const [description, setDescription] = useState("");
    const tags = useRef([]);
    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Bold,
            Heading
        ],
    })

    const resetInputs = () => {
        titleInputRef.current.value = '';
        setDescription("");
        editor.commands.clearContent();
        tags.current = [];
    };

    const handleAdd = (e) => {
        e?.preventDefault();
        e?.target.blur();
        const title = titleInputRef.current;
        const tag = tags.current;
        if (!description.trim().length && !title.value) return;
        addNote(title.value, description, tag);
        resetInputs();
    };

    const documentListener = (e) => {
        if (formRef.current && !formRef.current.contains(e.target)) {
            handleAdd();
            formRef.current.removeAttribute('form-clicked');
            document.removeEventListener('mousedown', documentListener);
        }
    };

    const formClickHandler = () => {
        if (!formRef.current.getAttribute('form-clicked')) {
            document.addEventListener('mousedown', documentListener);
            formRef.current.setAttribute('form-clicked', 'true');
        }
    };

    useEffect(() => {
        formRef.current.addEventListener('click', formClickHandler);

        return () => {
            formRef.current?.removeEventListener('click', formClickHandler);
            document.removeEventListener('mousedown', documentListener);
        };
    }, []);

    console.log("Add note component");

    return (
        <div {...props}>
            <form ref={formRef} className='group rounded-lg shadow-custom overflow-hidden bg-white relative'>
                <div className='hidden group-focus-within:block'>
                    <Input inputRef={titleInputRef} placeholder="Title" name="title" styleType='notes' />
                </div>
                <TailwindEditor className='min-h-[unset] py-0' setContent={setDescription} />

                <div className='hidden group-focus-within:block'>
                    <TagInput initTags={tags.current} customStyle="px-3" tagsValue={tags} />
                </div>
                <Button text="Close" className='hidden rounded group-focus-within:block float-right mr-3 mb-2 px-4 py-2 hover:bg-[rgba(95,99,104,0.039)] active:bg-[rgba(95,99,104,0.161)] focus-visible:outline-none focus-visible:bg-[rgba(95,99,104,0.039)]' handleClick={handleAdd} />
            </form>
        </div>
    );
});

export default Addnote;
