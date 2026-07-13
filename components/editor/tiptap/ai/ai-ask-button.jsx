"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useToolbar } from "../toolbars/toolbar-provider";
import { useAi } from "./ai-context";
import { useCallback, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export function AiAskButton({
  text = "Ask AI",
  showShortcut = true,
  hideWhenUnavailable = false,
  onAiAsked,
}) {
  const { editor } = useToolbar();
  const { updateState, setSelectedText } = useAi();

  const canAskAi = useCallback(() => {
    if (!editor) return false;
    const { from, to, empty } = editor.state.selection;
    if (empty) return true; // Allow AI generation even without selection
    const selectedText = editor.state.doc.textBetween(from, to, " ");
    return selectedText.length > 0;
  }, [editor]);

  const handleAskAi = useCallback(
    (e) => {
      e?.preventDefault?.();
      if (!editor) return;

      const { from, to, empty } = editor.state.selection;
      let selectedText = "";

      if (!empty) {
        selectedText = editor.state.doc.textBetween(from, to, " ");
      }

      setSelectedText(selectedText);
      updateState({ isOpen: true });
      onAiAsked?.();
    },
    [editor, setSelectedText, updateState, onAiAsked]
  );

  // Keyboard shortcut: Cmd/Ctrl + J
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        if (canAskAi()) {
          handleAskAi();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [canAskAi, handleAskAi]);

  if (hideWhenUnavailable && !canAskAi()) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAskAi}
            disabled={!canAskAi()}
            className="gap-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <Sparkles className="h-4 w-4" />
            {text && <span>{text}</span>}
            {showShortcut && (
              <Badge
                variant="secondary"
                className="ml-1 px-1.5 py-0 text-[10px] font-normal"
              >
                ⌘J
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ask AI to help with your content (⌘J)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
