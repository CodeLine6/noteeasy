import {
    CheckSquare,
    Code,
    Heading1,
    Heading2,
    Heading3,
    ImageIcon,
    List,
    ListOrdered,
    Text,
    TextQuote,
    Youtube
} from "lucide-react";
import { createSuggestionItems } from "novel/extensions";
import { Command, renderItems } from "novel/extensions";
import { uploadFn } from "./editor-image";

export const suggestionItems = createSuggestionItems([
    {
        title: "Text",
        description: "Just start typing with plain text.",
        searchTerms: ["p", "paragraph"],
        icon: <Text size={18} />,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleNode("paragraph", "paragraph")
                .run();
        },
    },
    {
        title: "To-do List",
        description: "Track tasks with a to-do list.",
        searchTerms: ["todo", "task", "list", "check", "checkbox"],
        icon: <CheckSquare size={18} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
    },
    {
        title: "Heading 1",
        description: "Big section heading.",
        searchTerms: ["title", "big", "large"],
        icon: <Heading1 size={18} />,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 1 })
                .run();
        },
    },
    {
        title: "Heading 2",
        description: "Medium section heading.",
        searchTerms: ["subtitle", "medium"],
        icon: <Heading2 size={18} />,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 2 })
                .run();
        },
    },
    {
        title: "Heading 3",
        description: "Small section heading.",
        searchTerms: ["subtitle", "small"],
        icon: <Heading3 size={18} />,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 3 })
                .run();
        },
    },
    {
        title: "Bullet List",
        description: "Create a simple bullet list.",
        searchTerms: ["unordered", "point"],
        icon: <List size={18} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
    },
    {
        title: "Numbered List",
        description: "Create a list with numbering.",
        searchTerms: ["ordered"],
        icon: <ListOrdered size={18} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
    },
    {
        title: "Quote",
        description: "Capture a quote.",
        searchTerms: ["blockquote"],
        icon: <TextQuote size={18} />,
        command: ({ editor, range }) =>
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleNode("paragraph", "paragraph")
                .toggleBlockquote()
                .run(),
    },
    {
        title: "Code",
        description: "Capture a code snippet.",
        searchTerms: ["codeblock"],
        icon: <Code size={18} />,
        command: ({ editor, range }) =>
            editor.chain().focus().deleteRange(range).setCustomCodeBlock().run(),
    },
    {
        title: "Image",
        description: "Upload an image from your computer.",
        searchTerms: ["photo", "picture", "media"],
        icon: <ImageIcon size={18} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).run();
            // upload image
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async () => {
                if (input.files?.length) {
                    const file = input.files[0];
                    const caption = prompt("Please enter image caption");
                    const pos = editor.view.state.selection.from;
                    const src = await uploadFn(file, editor.view, pos);
                    editor.commands.setFigure({ caption, src });
                }
            };
            input.click();
        },
    },
    {
        title: "Youtube",
        description: "Embed a Youtube video.",
        searchTerms: ["video", "youtube", "embed"],
        icon: <Youtube size={18} />,
        command: ({ editor, range }) => {
            const videoLink = prompt("Please enter Youtube Video Link");
            //From https://regexr.com/3dj5t
            const ytregex = new RegExp(
                /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
            );

            if (ytregex.test(videoLink)) {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setYoutubeVideo({
                        src: videoLink,
                    })
                    .run();
            } else {
                if (videoLink !== null) {
                    alert("Please enter a correct Youtube Video Link");
                }
            }
        },
    },
]);

const renderItemsCustom = (targetEl) => {
    return dummyFunction;
    //document.querySelector("[data-tippy-root]")?.appendTo(targetEl.current);
}

function dummyFunction() {
    alert("hello")
}
export const slashCommand = (targetEl) => Command.configure({
    suggestion: {
        items: () => suggestionItems,
        render: () => {
            const renderItemsContent = renderItems()
            return {
                onUpdate: renderItemsContent.onUpdate,
                onKeyDown: renderItemsContent.onKeyDown,
                onExit: renderItemsContent.onExit,
                onStart: (props) => {
                    renderItemsContent.onStart(props)
                    targetEl.current.append(document.querySelector("[data-tippy-root]"))
                }
            }
        },

    },
});
