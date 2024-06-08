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
import Underline from "@tiptap/extension-underline";


export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const convertJSONtoHTML = (html) => {
  const htmlContent = generateHTML(html, [
    StarterKit,
    Placeholder,
    TiptapLink,
    TiptapImage,
    UpdatedImage,
    TaskList,
    TaskItem,
    HorizontalRule,
    AIHighlight,
    Youtube,
    CharacterCount,
    TextStyle,
    Underline
  ])

  return htmlToText(htmlContent)
}

function htmlToText(html) {
  var temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent; // Or return temp.innerText if you need to return only visible text. It's slower.
}

export default convertJSONtoHTML