import React, { useContext, useRef, useEffect } from 'react';
import NotesContext from '../../context/Notes/NotesContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import TagInput from '../UI/TagInput';
import Editor from '../Editor/Editor';

const Addnote = () => {
    const { addNote, addNoteKey } = useContext(NotesContext);

    const formWrapperRef = useRef(null);
    const titleInputRef = useRef(null);
    const newNoteDescriptionEditorInstance = useRef(null);
    const description = useRef(null);
    const tags = useRef([]);
    const resetTags = useRef(null);

    const resetInputs = () => {
        titleInputRef.current.value = null;
        description.current = null;
        tags.current = [];
        resetTags.current();
        newNoteDescriptionEditorInstance.current.editor.commands.clearContent();
        newNoteDescriptionEditorInstance.current.setWordsCount({
            words: 0,
            characters: 0
        })
    };

    const handleAdd = (e) => {
        e?.preventDefault();
        e?.target.blur();
        const title = titleInputRef.current.value;
        if (newNoteDescriptionEditorInstance.current.editor.getText() === '') return
        addNote(title, description.current, tags.current);
        resetInputs();
    };

    const documentListener = (e) => {
        if (!formWrapperRef.current.contains(e.target)) {
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
        <div className='group w-full' ref={formWrapperRef} >
            <form className='rounded-lg shadow-custom overflow-hidden bg-white relative' >
                <div className='hidden group-focus-within:block'>
                    <Input inputRef={titleInputRef} placeholder="Title" name="title" styleType='notes' value={null} />
                </div>
                <Editor key={`${addNoteKey}`} content={description} parent={formWrapperRef} editorInstance={newNoteDescriptionEditorInstance} />
                <div className='hidden group-focus-within:block'>
                    <TagInput customStyle="px-3" tagsValue={tags} resetTagsRef={resetTags} />
                </div>
                <Button text="Close" className='hidden rounded group-focus-within:block float-right mr-3 mb-2 px-4 py-2 hover:bg-[rgba(95,99,104,0.039)] active:bg-[rgba(95,99,104,0.161)] focus-visible:outline-none focus-visible:bg-[rgba(95,99,104,0.039)]' handleClick={handleAdd} />
            </form>
        </div>
    );
};

export default Addnote;
