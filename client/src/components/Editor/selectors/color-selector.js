import { Check, ChevronDown } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";

import {Portal,Content} from '@radix-ui/react-popover';
import { Popover,PopoverTrigger } from "../../UI/popover";
import { Button } from "../../UI/Button2";


const TEXT_COLORS = [
  {
    name: "Default",
    color: "var(--novel-black)",
  },
  {
    name: "Purple",
    color: "#9333EA",
  },
  {
    name: "Red",
    color: "#E00000",
  },
  {
    name: "Yellow",
    color: "#EAB308",
  },
  {
    name: "Blue",
    color: "#2563EB",
  },
  {
    name: "Green",
    color: "#008A00",
  },
  {
    name: "Orange",
    color: "#FFA500",
  },
  {
    name: "Pink",
    color: "#BA4081",
  },
  {
    name: "Gray",
    color: "#A8A29E",
  },
];

const HIGHLIGHT_COLORS = [
  {
    name: "Default",
    color: "var(--novel-highlight-default)",
  },
  {
    name: "Purple",
    color: "var(--novel-highlight-purple)",
  },
  {
    name: "Red",
    color: "var(--novel-highlight-red)",
  },
  {
    name: "Yellow",
    color: "var(--novel-highlight-yellow)",
  },
  {
    name: "Blue",
    color: "var(--novel-highlight-blue)",
  },
  {
    name: "Green",
    color: "var(--novel-highlight-green)",
  },
  {
    name: "Orange",
    color: "var(--novel-highlight-orange)",
  },
  {
    name: "Pink",
    color: "var(--novel-highlight-pink)",
  },
  {
    name: "Gray",
    color: "var(--novel-highlight-gray)",
  },
];

export const ColorSelector = ({ open, onOpenChange,containerRef }) => {
  const { editor } = useEditor();

  if (!editor) return null;
  const activeColorItem = TEXT_COLORS.find(({ color }) => editor.isActive("textStyle", { color }));

  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
    editor.isActive("highlight", { color })
  );

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button className='gap-2 rounded-none' variant='ghost'>
          <span
            className='rounded-sm px-1'
            style={{
              color: activeColorItem?.color,
              backgroundColor: activeHighlightItem?.color,
            }}>
            A
          </span>
          <ChevronDown className='h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <Portal container={containerRef.current}>
        <Content
          sideOffset={5}
          className='z-50 bg-popover text-popover-foreground outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl'
          align='start'>
          <div className='flex flex-col'>
            <div className='my-1 px-2 text-sm font-semibold text-muted-foreground'>Color</div>
            {TEXT_COLORS.map(({ name, color }, index) => (
              <EditorBubbleItem
                key={index}
                onSelect={() => {
                  editor.commands.unsetColor();
                  onOpenChange(false)
                  name !== "Default" &&
                    editor
                      .chain()
                      .focus()
                      .setColor(color || "")
                      .run();
                }}
                className='flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent'>
                <div className='flex items-center gap-2'>
                  <div className='rounded-sm border px-2 py-px font-medium' style={{ color }}>
                    A
                  </div>
                  <span>{name}</span>
                </div>
              </EditorBubbleItem>
            ))}
          </div>
          <div>
            <div className='my-1 px-2 text-sm font-semibold text-muted-foreground'>Background</div>
            {HIGHLIGHT_COLORS.map(({ name, color }, index) => (
              <EditorBubbleItem
                key={index}
                onSelect={() => {
                  editor.commands.unsetHighlight();
                  name !== "Default" && editor.commands.setHighlight({ color });
                }}
                className='flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent'>
                <div className='flex items-center gap-2'>
                  <div
                    className='rounded-sm border px-2 py-px font-medium'
                    style={{ backgroundColor: color }}>
                    A
                  </div>
                  <span>{name}</span>
                </div>
                {editor.isActive("highlight", { color }) && <Check className='h-4 w-4' />}
              </EditorBubbleItem>
            ))}
          </div>
        </Content>
      </Portal>
    </Popover>
  );
};
