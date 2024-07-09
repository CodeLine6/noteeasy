import { Mark } from "@tiptap/core";
import { calcYchangeStyle, hoverWrapper } from "./helpers";

const YChange = Mark.create({
  name: "ychange",
  inclusive: false,
  addAttributes() {
    return {
      user: { default: null },
      type: { default: null },
      color: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "ychange" }];
  },
  renderHTML({ mark: node }) {
    return [
      "ychange",
      {
        ychange_user: node.attrs.user,
        ychange_type: node.attrs.type,
        style: calcYchangeStyle(node.attrs),
      },
      ...hoverWrapper(node.attrs, [0]),
    ];
  },
});

export default YChange