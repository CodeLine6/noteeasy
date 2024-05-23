import { generateHTML } from "@tiptap/html"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  TiptapImage,
  TiptapLink,
  CharacterCount,
  UpdatedImage,
  TaskList,
  TaskItem,
  HorizontalRule,
  StarterKit,
  Placeholder,
  AIHighlight,
  Youtube,
} from "novel/extensions";
import TextStyle from "@tiptap/extension-text-style";


export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const convertJSONtoHTML = (html) => {
  const jsonContent = generateHTML(html, [
    TiptapImage,
    TiptapLink,
    CharacterCount,
    UpdatedImage,
    TaskList,
    TaskItem,
    HorizontalRule,
    StarterKit,
    Placeholder,
    AIHighlight,
    Youtube,
    TextStyle
  ])
  return jsonContent
}

export default convertJSONtoHTML