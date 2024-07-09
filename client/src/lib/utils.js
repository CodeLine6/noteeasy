import { generateHTML } from "@tiptap/html"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  TiptapLink,
  CharacterCount,
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
import { colors } from "../components/Editor/constants";
import tiptapImage from "../components/Editor/extensions/image";


export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const convertJSONtoHTML = (html) => {
  const htmlContent = generateHTML(html, [
    StarterKit,
    Placeholder,
    TiptapLink,
    TaskList,
    TaskItem,
    HorizontalRule,
    AIHighlight,
    Youtube,
    CharacterCount,
    TextStyle,
    Underline,
    tiptapImage
  ])

  return htmlContent
}

function htmlToText(html) {
  var temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent; // Or return temp.innerText if you need to return only visible text. It's slower.
}



const getRandomElement = (list) =>
  list[Math.floor(Math.random() * list.length)];

export const getRandomColor = () => getRandomElement(colors);

