"use client";

import { BoldToolbar } from "../toolbars/bold";
import { ItalicToolbar } from "../toolbars/italic";
import { UnderlineToolbar } from "../toolbars/underline";
import { LinkToolbar } from "../toolbars/link";
import { ColorHighlightToolbar } from "../toolbars/color-and-highlight";
import { ToolbarProvider } from "../toolbars/toolbar-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { HeadingsToolbar } from "../toolbars/headings";
import { BulletListToolbar } from "../toolbars/bullet-list";
import { OrderedListToolbar } from "../toolbars/ordered-list";
import { ImagePlaceholderToolbar } from "../toolbars/image-placeholder-toolbar";
import { AlignmentTooolbar } from "../toolbars/alignment";
import { BlockquoteToolbar } from "../toolbars/blockquote";
import { useEffect, useState } from "react";

export function FloatingToolbar({ editor }) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!editor || !isMobile) {
      setIsVisible(false);
      return;
    }

    const updateToolbar = () => {
      const { selection } = editor.state;
      const { from, to } = selection;

      // Show toolbar when editor is focused
      if (editor.isEditable && editor.isFocused) {
        setIsVisible(true);

        // Calculate position
        const coords = editor.view.coordsAtPos(from);
        setPosition({
          top: coords.bottom + 10,
          left: coords.left,
        });
      } else {
        setIsVisible(false);
      }
    };

    editor.on("focus", updateToolbar);
    editor.on("blur", updateToolbar);
    editor.on("selectionUpdate", updateToolbar);
    editor.on("update", updateToolbar);

    return () => {
      editor.off("focus", updateToolbar);
      editor.off("blur", updateToolbar);
      editor.off("selectionUpdate", updateToolbar);
      editor.off("update", updateToolbar);
    };
  }, [editor, isMobile]);

  // Prevent default context menu on mobile
  useEffect(() => {
    if (!editor?.options.element || !isMobile) return;

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const el = editor.options.element;
    el.addEventListener("contextmenu", handleContextMenu);

    return () => el.removeEventListener("contextmenu", handleContextMenu);
  }, [editor, isMobile]);

  if (!editor || !isMobile || !isVisible) return null;

  return (
    <TooltipProvider>
      <div className="fixed bottom-0 left-0 right-0 z-50 w-full shadow-sm border-t rounded-none bg-background">
        <ToolbarProvider editor={editor}>
          <ScrollArea className="h-fit py-0.5 w-full">
            <div className="flex items-center px-2 gap-0.5">
              <div className="flex items-center gap-0.5 p-1">
                {/* Primary formatting */}
                <BoldToolbar />
                <ItalicToolbar />
                <UnderlineToolbar />
                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Structure controls */}
                <HeadingsToolbar />
                <BulletListToolbar />
                <OrderedListToolbar />
                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Rich formatting */}
                <ColorHighlightToolbar />
                <LinkToolbar />
                <ImagePlaceholderToolbar />
                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Additional controls */}
                <AlignmentTooolbar />
                <BlockquoteToolbar />
              </div>
            </div>
            <ScrollBar className="h-0.5" orientation="horizontal" />
          </ScrollArea>
        </ToolbarProvider>
      </div>
    </TooltipProvider>
  );
}
