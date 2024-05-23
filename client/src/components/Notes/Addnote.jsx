import React, { useContext, useRef, useEffect, useState } from 'react';
import NotesContext from '../../context/Notes/NotesContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import TagInput from '../UI/TagInput';
import TailwindEditor from '../Editor/Editor';


const Addnote = React.memo(() => {
    const { addNote } = useContext(NotesContext);

    const formWrapperRef = useRef(null);
    const titleInputRef = useRef(null);
    const description = useRef(null);
    const editorData = useRef({});
    const tags = useRef([]);
    const tagsSetter = useRef(null);

    const resetInputs = () => {
        titleInputRef.current.value = '';
        description.current = null;
        editorData.current.editor.commands.clearContent();
        editorData.current.setCharsCount(0);
        tags.current = [];
        tagsSetter.current([]);
    };

    const handleAdd = (e) => {
        e?.preventDefault();
        e?.target.blur();
        const title = titleInputRef.current;
        const tag = tags.current;
        if (!description.current && !title.value) return;
        addNote(title.value, description.current, tag);
        resetInputs();
    };

    const documentListener = (e) => {
        if (formWrapperRef.current && !formWrapperRef.current.contains(e.target)) {
            handleAdd();
            formWrapperRef.current.removeAttribute('form-clicked');
            document.removeEventListener('mousedown', documentListener);
        }
    };

    const formClickHandler = () => {
        if (!formWrapperRef.current.getAttribute('form-clicked')) {
            document.addEventListener('mousedown', documentListener);
            formWrapperRef.current.setAttribute('form-clicked', 'true');
        }
    };

    useEffect(() => {
        formWrapperRef.current.addEventListener('click', formClickHandler);

        return () => {
            formWrapperRef.current?.removeEventListener('click', formClickHandler);
            document.removeEventListener('mousedown', documentListener);
        };
    }, []);

    console.log("Add note component");

    return (
        <div className='group w-full' ref={formWrapperRef}>
            <form className='rounded-lg shadow-custom overflow-hidden bg-white relative'>
                <div className='hidden group-focus-within:block'>
                    <Input inputRef={titleInputRef} placeholder="Title" name="title" styleType='notes' />
                </div>
                <TailwindEditor key="new" className='min-h-[unset] py-0' setContent={description} editorData={editorData} parent={formWrapperRef} />
                <div className='hidden group-focus-within:block'>
                    <TagInput customStyle="px-3" tagsValue={tags} tagsSetter={tagsSetter} />
                </div>
                <Button text="Close" className='hidden rounded group-focus-within:block float-right mr-3 mb-2 px-4 py-2 hover:bg-[rgba(95,99,104,0.039)] active:bg-[rgba(95,99,104,0.161)] focus-visible:outline-none focus-visible:bg-[rgba(95,99,104,0.039)]' handleClick={handleAdd} />
            </form>
        </div>
    );
});

export default Addnote;
