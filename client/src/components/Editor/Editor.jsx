import { EditorBubble, EditorCommand, EditorCommandEmpty, EditorCommandItem, EditorContent, EditorRoot } from "novel";
import { defaultExtensions, slashCommand, suggestionItems } from "./extensions";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { ColorSelector } from "./selectors/color-selector";
import { TextButtons } from "./selectors/text-buttons";
import { handleCommandNavigation } from "novel/extensions";
import { useState } from "react";
import './Prosemirror.css';

const TailwindEditor = ({ initialContent = "", setContent, setEditor = null }) => {
    const [openLink, setOpenLink] = useState(null);
    const [openColor, setOpenColor] = useState(false);
    const [openNode, setOpenNode] = useState(null);

    return (
        <EditorRoot>
            <EditorContent
                initialContent={initialContent}
                extensions={[...defaultExtensions, slashCommand]}
                editorProps={{
                    handleDOMEvents: {
                        keydown: (_view, event) => handleCommandNavigation(event),
                    },
                    attributes: {
                        class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
                    }
                }}
                className="outline-none border-none"
                onUpdate={({ editor }) => {
                    const html = editor.getHTML();
                    setContent.current = html;
                }}
                onCreate={({ editor }) => {
                    const html = editor.getHTML();
                    setContent.current = html;
                    if (!setEditor) return
                    setEditor.current = editor;
                }}

            >
                <EditorCommand className='z-50 h-auto max-h-[330px]  w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all'>
                    <EditorCommandEmpty className='px-2 text-muted-foreground'>No results</EditorCommandEmpty>
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
                </EditorCommand>
                <EditorBubble
                    tippyOptions={{
                        placement: "bottom-start",
                    }}
                    className='flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl'>
                    <NodeSelector open={openNode} onOpenChange={setOpenNode} />
                    <LinkSelector open={openLink} onOpenChange={setOpenLink} />
                    <TextButtons />
                    <ColorSelector open={openColor} onOpenChange={setOpenColor} />
                </EditorBubble>


            </EditorContent>
        </EditorRoot>
    );
};
export default TailwindEditor;
