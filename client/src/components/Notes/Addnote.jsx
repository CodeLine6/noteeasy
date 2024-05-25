import React, { useContext, useRef, useEffect } from 'react';
import NotesContext from '../../context/Notes/NotesContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import TagInput from '../UI/TagInput';
import TailwindEditor from '../Editor/Editor';
import { useState } from 'react';


const Addnote = () => {
    const { addNote } = useContext(NotesContext);

    const formWrapperRef = useRef(null);
    const titleInputRef = useRef(null);
    const description = useRef(null);
    const tags = useRef([]);
    const resetTags = useRef(null);
    const [editoryKey, setEditorKey] = useState(0)
    const [active, setActive] = useState(false)

    const resetInputs = () => {
        titleInputRef.current.value = null;
        description.current = null;
        tags.current = [];
        resetTags.current();
    };

    const handleAdd = (e) => {
        e?.preventDefault();
        e?.target.blur();
        const title = titleInputRef.current.value !== '' ? titleInputRef.current.value : 'Untitled';
        addNote(title, description.current, tags.current);
        resetInputs();
    };

    const documentListener = (e) => {
        if (!formWrapperRef.current.contains(e.target)) {
            setActive(false)
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

    const handleFocus = () => {
        if (active) return
        setEditorKey(prev => prev + 1)
        setActive(true)
    }

    const handleBlur = () => {
        if (formWrapperRef.current.getAttribute('form-clicked')) return
        setActive(false)
    }


    return (
        <div className='group w-full' ref={formWrapperRef} onMouseEnter={handleFocus} onMouseLeave={handleBlur} >
            <form className='rounded-lg shadow-custom overflow-hidden bg-white relative' >
                <div>
                    <Input inputRef={titleInputRef} placeholder="Title" name="title" styleType='notes' value={null} />
                </div>
                <TailwindEditor key={`${editoryKey}`} setContent={description} className='hidden group-focus-within:block' parent={formWrapperRef} />
                <div className='hidden group-focus-within:block'>
                    <TagInput customStyle="px-3" tagsValue={tags} resetTagsRef={resetTags} />
                </div>
                <Button text="Close" className='hidden rounded group-focus-within:block float-right mr-3 mb-2 px-4 py-2 hover:bg-[rgba(95,99,104,0.039)] active:bg-[rgba(95,99,104,0.161)] focus-visible:outline-none focus-visible:bg-[rgba(95,99,104,0.039)]' handleClick={handleAdd} />
            </form>
        </div>
    );
};

export default Addnote;
