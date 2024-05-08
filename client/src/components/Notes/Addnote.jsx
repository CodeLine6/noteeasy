import React, { useContext, useRef, useEffect } from 'react';
import NotesContext from '../../context/Notes/NotesContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import TagInput from '../UI/TagInput';

const Addnote = React.memo(({ children, ...props }) => {
    const { addNote } = useContext(NotesContext);

    const formRef = useRef(null);
    const titleInputRef = useRef(null);
    const descriptionInputRef = useRef(null);
    const tags = useRef([]);

    const resetInputs = () => {
        titleInputRef.current.value = '';
        descriptionInputRef.current.innerText = null;
        tags.current = [];
    };

    const handleAdd = (e) => {
        e?.preventDefault();
        e?.target.blur();

        const title = titleInputRef.current;
        const description = descriptionInputRef.current;
        const tag = tags.current;
        if (!description.innerText && !title.value) return;
        addNote(title.value, description.innerText, tag);
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
                <div contentEditable="true" className='pl-3 my-2 outline-none text-lg cursor-text group-focus-within:text-base group-focus-within:mt-0 empty:before:absolute empty:before:opacity-50 empty:before:content-["Take_a_note..."] min-h-6' ref={descriptionInputRef}></div>
                <div className='hidden group-focus-within:block'>
                    <TagInput initTags={tags.current} customStyle="px-3" tagsValue={tags} />
                </div>
                <Button text="Close" className='hidden rounded group-focus-within:block float-right mr-3 mb-2 px-4 py-2 hover:bg-[rgba(95,99,104,0.039)] active:bg-[rgba(95,99,104,0.161)] focus-visible:outline-none focus-visible:bg-[rgba(95,99,104,0.039)]' handleClick={handleAdd} />
            </form>
        </div>
    );
});

export default Addnote;
