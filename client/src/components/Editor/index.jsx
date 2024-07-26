import { EditorBubble, EditorCommand, EditorCommandEmpty, EditorCommandItem, EditorCommandList, EditorContent, EditorRoot } from "novel";
import { suggestionItems } from "./slash-command";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { ColorSelector } from "./selectors/color-selector";
import { TextButtons } from "./selectors/text-buttons";
import { handleCommandNavigation } from "novel/extensions";
import { useRef, useState } from "react";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { onDelete, uploadFn } from "./editor-image";
import { useDebouncedCallback } from "use-debounce";

import './Prosemirror.css';

const Editor = ({ editorExtensions, setEditorInstance, preview }) => {
    const [openLink, setOpenLink] = useState(null);
    const [openColor, setOpenColor] = useState(false);
    const [openNode, setOpenNode] = useState(null);
    const [wordsCount, setWordsCount] = useState({ words: 0, characters: 0 });
    const [previousImages, setPreviousImages] = useState([]);
    const editorRef = useRef(null)
    const bubbleRef = useRef(null)

    const debouncedUpdates = useDebouncedCallback(async (editor) => {
        setWordsCount({
            words: editor.storage.characterCount.words(),
            characters: editor.storage.characterCount.characters()
        });
    }, 500);

    const getImageNodes = doc => {
        let images = [];
        doc.descendants(node => {
            if (node.type.name === 'image') {
                images.push(node);
            }
        });
        return images;
    };


    return (
        <div className="relative w-full max-w-screen-lg">
            <div className="flex absolute right-5 top-1 z-10 mb-5 gap-2">
                <div className={wordsCount.words ? "rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground" : "hidden"}>
                    {wordsCount.words} Words
                </div>
                <div className={wordsCount.characters ? "rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground" : "hidden"}>
                    {wordsCount.characters} Chars
                </div>
            </div>
            <EditorRoot>
                <EditorContent
                    extensions={editorExtensions}
                    autofocus={false}
                    editorProps={{
                        handleDOMEvents: {
                            keydown: (_view, event) => handleCommandNavigation(event),
                        },
                        autofocus: false,
                        attributes: {
                            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
                        },
                        handlePaste: (view, event) => handleImagePaste(view, event, async (...args) => {
                            const url = await uploadFn(...args);
                            editorRef.current.commands.setFigure({ src: url });
                        }),
                        handleDrop: (view, event, _slice, moved) =>
                            handleImageDrop(view, event, moved, async (...args) => {
                                const url = await uploadFn(...args);
                                editorRef.current.commands.setFigure({ src: url });
                            }),

                    }}
                    onUpdate={({ editor }) => {

                        debouncedUpdates(editor)
                        if (preview) return
                        const currentImages = getImageNodes(editor.state.doc);

                        // Detect removed images
                        const removedImages = previousImages.filter(prevImage => {
                            return !currentImages.some(currImage => currImage.attrs.src === prevImage.attrs.src);
                        });

                        if (removedImages.length > 0) {
                            removedImages.forEach(image => {
                                onDelete(image.attrs.src);
                            });
                        }
                        // Update the previous state to the current state
                        setPreviousImages(currentImages);
                    }}
                    onCreate={({ editor }) => {
                        editorRef.current = editor
                        setEditorInstance(editor)
                    }}
                >
                    <EditorCommand tabIndex={1} className='z-50 h-auto max-h-[330px]  w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all'>
                        <EditorCommandEmpty className='px-2 text-muted-foreground'>No results</EditorCommandEmpty>
                        <EditorCommandList>
                            {suggestionItems.map((item) => (
                                <EditorCommandItem
                                    value={item.title}
                                    onCommand={(val) => item.command(val)}
                                    className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent  cursor-pointer`}
                                    key={item.title}>
                                    <div className='flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-white'>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className='font-medium'>{item.title}</p>
                                        <p className='text-xs text-muted-foreground'>{item.description}</p>
                                    </div>
                                </EditorCommandItem>
                            ))}
                        </EditorCommandList>
                    </EditorCommand>
                    <EditorBubble
                        tippyOptions={{
                            placement: "bottom-start",
                        }}
                        ref={bubbleRef}
                        className='flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl'>
                        <NodeSelector open={openNode} onOpenChange={setOpenNode} containerRef={bubbleRef} />
                        <LinkSelector open={openLink} onOpenChange={setOpenLink} containerRef={bubbleRef} />
                        <TextButtons />
                        <ColorSelector open={openColor} onOpenChange={setOpenColor} containerRef={bubbleRef} />
                    </EditorBubble>
                </EditorContent>
            </EditorRoot>
        </div>
    );
};
export default Editor;