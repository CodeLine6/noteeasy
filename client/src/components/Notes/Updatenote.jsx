import React, { useContext, useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import NotesContext from '../../context/Notes/NotesContext';
import Input from '../UI/Input';
import Button from '../UI/Button';

import TagInput from '../UI/TagInput';

import { useAuth } from '../../context/authContext';
import { getRandomColor } from '../../lib/utils';

import UpdateEditor from '../Editor';
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import { defaultExtensions } from "../Editor/extensions";
import { slashCommand } from "../Editor/slash-command";
import { IndexeddbPersistence } from 'y-indexeddb'

const Updatenote = ({ closeModal }) => {
    const formRef = useRef(null);
    const [editor, setEditor] = useState(null)

    const { updateNote, toModify } = useContext(NotesContext);
    const titleInput = useRef(null);
    const tags = useRef(toModify?.tag || []);

    const currUser = {
        name: useAuth().user.name,
        color: getRandomColor(),
    }

    const [yDoc, permanentUserData, provider] = useMemo(() => {
        const yDoc = new Y.Doc({ gc: false });
        const permanentUserData = new Y.PermanentUserData(yDoc);
        const provider = new TiptapCollabProvider({
            document: yDoc,
            name: toModify._id,
            baseUrl: process.env.REACT_APP_YJS_BASE_URL,
        })

        return [yDoc, permanentUserData, provider]
    }, [])

    /*     const provider = useMemo(() => new IndexeddbPersistence(toModify._id, yDoc), []);
     */

    const editorExtensions = useMemo(() =>
        [
            ...defaultExtensions,
            slashCommand(formRef),
            Collaboration.configure({
                document: yDoc,
                ySyncOptions: {
                    permanentUserData,
                    colors: [
                        { light: "#ecd44433", dark: "#ecd444" },
                        { light: "#ee635233", dark: "#ee6352" },
                        { light: "#6eeb8333", dark: "#6eeb83" },
                    ],
                },
            }),
            CollaborationCursor.configure({
                provider,
                user: currUser
            }),
        ]
        , [])


    useEffect(() => {
        titleInput.current.value = toModify.title.replace(/<mark[^>]*>|<\/mark>/g, '');
        permanentUserData.setUserMapping(yDoc, yDoc.clientID, currUser.name);
        return () => provider.destroy()
    }, [])


    const handleClose = async () => {
        updateNote(toModify._id, titleInput.current, editor.getJSON(), tags.current);
        closeModal();
    }

    const handleEscape = (e) => {
        if (e['code'] === 'Escape') {
            e.preventDefault();
            updateNote(toModify._id, titleInput.current, editor.getJSON(), tags.current);
            closeModal()
        }
    }

    return (
        <motion.form className='min-w-[750px] bg-white pb-10 relative' initial={{ opacity: 0 }} animate={{ opacity: 1 }} ref={formRef} onKeyDown={handleEscape}>
            <div className='max-h-[500px] overflow-x-auto pt-1 p-3'>
                <Input inputRef={titleInput} placeholder='Title' name='title' styleType='notes' classes="font-bold" />
                <UpdateEditor setEditorInstance={setEditor} editorExtensions={editorExtensions} />
                <TagInput customStyle="px-3" tagsValue={tags} />
            </div>

            <Button text="Update" className='rounded absolute right-5 bottom-2 px-4 py-2 hover:bg-[rgba(95,99,104,0.039)] active:bg-[rgba(95,99,104,0.161)] focus-visible:outline-none focus-visible:bg-[rgba(95,99,104,0.039)]' handleClick={handleClose} />
        </motion.form>
    )
}
export default Updatenote