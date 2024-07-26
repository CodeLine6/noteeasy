import { useEffect, useMemo, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../UI/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../UI/tooltip"
import { DropdownMenuItem } from "../UI/dropdown-menu"
import { ScrollArea } from "../UI/scroll-area";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { MdHistory } from "react-icons/md";
import { PiEye } from "react-icons/pi";

import PreviewEditor from '../Editor';
import * as Y from 'yjs'
import { defaultExtensions } from "../Editor/extensions";
import Collaboration from "@tiptap/extension-collaboration";
import { formatDistance } from "date-fns";
import { ySyncPluginKey } from "y-prosemirror";

const NoteVersionModal = ({ note }) => {
    const [editor, setEditor] = useState(null)

    const [previewDoc, permanentUserData] = useMemo(() => {
        const previewDoc = new Y.Doc({ gc: false })
        const permanentUserData = new Y.PermanentUserData(previewDoc);

        return [previewDoc, permanentUserData]
    }, [])

    const editorExtensions = useMemo(() =>
        [
            ...defaultExtensions,
            Collaboration.configure({
                document: previewDoc,
                ySyncOptions: {
                    permanentUserData,
                    colors: [
                        { light: "#ecd44433", dark: "#ecd444" },
                        { light: "#ee635233", dark: "#ee6352" },
                        { light: "#6eeb8333", dark: "#6eeb83" },
                    ],
                },
            }),
        ]
        , [previewDoc])

    useEffect(() => {
        const fetchDocState = async () => {
            const request = await fetch(`${process.env.REACT_APP_API_HOST}/api/notes/state/${note._id}`, {
                headers: {
                    "auth-token": localStorage.getItem('authToken'),
                },
            })
            if (!request.ok) {
                return
            }
            const parsedResponse = await request.arrayBuffer()
            const uint8Array = new Uint8Array(parsedResponse);
            Y.applyUpdate(previewDoc, uint8Array)

        }
        fetchDocState()
    })

    useEffect(() => {
        if (!editor) return
        editor.setOptions({ editable: false })
    }, [editor])


    return <Dialog>
        <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => {
                e.preventDefault()
                e.target.parentNode.parentNode.style.opacity = 0
            }}>
                Version Control
            </DropdownMenuItem>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] md:max-w-[900px] ">
            <DialogHeader>
                <DialogTitle>Preview</DialogTitle>
            </DialogHeader>
            <div className="grid flex-1 gap-5 overflow-auto p-4 px-0 md:grid-cols-2 lg:grid-cols-3">
                <div className="relative flex h-[50vh] flex-col rounded-xl bg-muted/50 lg:col-span-2 version-preview">
                    <ScrollArea className="h-full py-4">
                        <PreviewEditor setEditorInstance={setEditor} editorExtensions={editorExtensions} preview />
                    </ScrollArea>
                </div>
                <div
                    className="relative hidden flex-col items-stretch gap-2 md:flex max-h-[50vh]"
                >
                    <legend className="-ml-1 px-1 text-sm font-medium">Version History</legend>
                    <p className="text-xs text-muted-foreground">Browse previous versions of your note.</p>
                    {editor && <Snapshots view={editor.view} doc={previewDoc} note={note} />}
                </div>
            </div>
        </DialogContent>
    </Dialog>
}

const Snapshots = ({ view: { state, dispatch }, doc, note }) => {
    const [versions, setVersions] = useState([])
    useEffect(() => {
        setVersions(doc.getArray("versions"));
    }, []);

    const renderSnapshot = (snapshot, prevSnapshot) => {
        const { tr } = state;
        const binding = ySyncPluginKey.getState(state).binding;
        binding?.unrenderSnapshot();

        dispatch(
            tr.setMeta(ySyncPluginKey, {
                snapshot: Y.decodeSnapshot(snapshot),
                prevSnapshot:
                    prevSnapshot == null
                        ? Y.decodeSnapshot(snapshot)
                        : Y.decodeSnapshot(prevSnapshot),
            }),
        );
        //setVersions(previewDoc.getArray("versions"))
    };

    const handleRestore = async (snapShotInddex, e) => {
        const request = await fetch(`${process.env.REACT_APP_API_HOST}/api/notes/${note._id}/restore-version/${snapShotInddex}`, {
            headers: {
                "auth-token": localStorage.getItem('authToken'),
            },
            method: "GET"
        })

        if (!request.ok) {
            return false
        }

        const target = e.target;
        const parentNode = target.closest(".flex.items-center.space-x-4")
        while (parentNode.nextSibling) {
            parentNode.nextSibling.remove()
        }

    }

    return (
        <ScrollArea className="flex-grow">
            {versions?.map((version, index) => (
                <VersionCard
                    isOwner={note.isOwner}
                    key={index}
                    version={version} handleRender={() => renderSnapshot(version.snapshot, versions?.get(index - 1)?.snapshot)}
                    handleRestore={(e) => handleRestore(index, e)}
                />))}
        </ScrollArea>
    )
}


const VersionCard = ({ version, handleRender, handleRestore, isOwner }) => {
    const versionTime = formatDistance(version.date, new Date(), { addSuffix: true })
    return <div className="flex items-center space-x-4 border hover:bg-gray-100 hover:text-gray-700 p-4">
        <MdOutlineStickyNote2 className="h-5 w-5" />
        <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
                {versionTime.charAt(0).toUpperCase() + versionTime.slice(1)}
            </p>
        </div>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger><PiEye onClick={handleRender} className="h-5 w-5" /></TooltipTrigger>
                <TooltipContent>
                    <p>Preview</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        {isOwner && <TooltipProvider>
            <Tooltip>
                <TooltipTrigger><MdHistory onClick={(e) => handleRestore(e)} className="h-5 w-5" /></TooltipTrigger>
                <TooltipContent>
                    <p>Restore</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>}
    </div>
}

export default NoteVersionModal