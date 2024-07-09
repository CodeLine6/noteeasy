import {
  findChildrenInRange,
  mergeAttributes,
  Node,
  nodeInputRule,
  Tracker,
} from '@tiptap/core'

import { UploadImagesPlugin } from "novel/plugins";
import { cx } from "class-variance-authority";


const inputRegex = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/

const tiptapImage = Node.create({
  name: 'image',

  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {

      },
    };
  },

  group: 'block',

  content: 'inline*',

  draggable: true,


  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.querySelector('img')?.getAttribute('src'),
      },
      alt: {
        default: null,
        parseHTML: element => element.querySelector('img')?.getAttribute('alt'),
      },
      title: {
        default: null,
        parseHTML: element => element.querySelector('img')?.getAttribute('title'),
      },
      width: {
        default: 'auto',
        parseHTML: element => element.querySelector('img')?.style.width || 'auto',
      },
      height: {
        default: 'auto',
        parseHTML: element => element.querySelector('img')?.style.height || 'auto',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        contentElement: 'figcaption',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return ["figure", this.options.HTMLAttributes,
      ['img', mergeAttributes({
        src: HTMLAttributes.src,
        draggable: false,
        contenteditable: false,
        style: `width: ${HTMLAttributes.width}; height: ${HTMLAttributes.height};`
      })],
      ["figcaption", node.content.size > 0 ? 0 : "Image"]
    ];
  },

  addCommands() {
    return {
      setFigure: ({ caption, ...attrs }) => ({ chain }) => {
        return chain()
          .insertContent({
            type: this.name,
            attrs,
            content: caption
              ? [{ type: 'text', text: caption }]
              : [{ type: 'text', text: "Image" }],
          })
          // set cursor at end of caption field
          .command(({ tr, commands }) => {
            const { doc, selection } = tr
            const position = doc.resolve(selection.to - 2).end()

            return commands.setTextSelection(position)
          })
          .run()
      },
      imageToFigure: () => ({ tr, commands }) => {
        const { doc, selection } = tr
        const { from, to } = selection
        const images = findChildrenInRange(doc, { from, to }, node => node.type.name === 'image')

        if (!images.length) {
          return false
        }

        const tracker = new Tracker(tr)

        return commands.forEach(images, ({ node, pos }) => {
          const mapResult = tracker.map(pos)

          if (mapResult.deleted) {
            return false
          }

          const range = {
            from: mapResult.position,
            to: mapResult.position + node.nodeSize,
          }

          return commands.insertContentAt(range, {
            type: this.name,
            attrs: {
              src: node.attrs.src,
            },
          })
        })
      },

      figureToImage: () => ({ tr, commands }) => {
        const { doc, selection } = tr
        const { from, to } = selection
        const figures = findChildrenInRange(doc, { from, to }, node => node.type.name === this.name)

        if (!figures.length) {
          return false
        }

        const tracker = new Tracker(tr)

        return commands.forEach(figures, ({ node, pos }) => {
          const mapResult = tracker.map(pos)

          if (mapResult.deleted) {
            return false
          }

          const range = {
            from: mapResult.position,
            to: mapResult.position + node.nodeSize,
          }

          return commands.insertContentAt(range, {
            type: 'image',
            attrs: {
              src: node.attrs.src,
            },
          })
        })
      },

    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: match => {
          const [, src, alt, title] = match

          return { src, alt, title }
        },
      }),
    ]
  },

  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cx("opacity-40 rounded-lg border border-stone-200"),
      }),
    ];
  },
})

export default tiptapImage