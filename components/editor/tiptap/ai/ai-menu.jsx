"use client";

import React from "react";

import { useState, useCallback, useRef, useEffect } from "react";
import { useAi } from "./ai-context";
import { useToolbar } from "../toolbars/toolbar-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  X,
  Check,
  RefreshCw,
  Wand2,
  Languages,
  FileText,
  Minimize2,
  Maximize2,
  Smile,
  Type,
  Loader2,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AI_ACTIONS = [
  {
    id: "improve",
    label: "Improve Writing",
    icon: <Wand2 className="h-4 w-4" />,
    prompt: "Improve the following text to make it clearer and more engaging:",
    category: "edit",
  },
  {
    id: "fix",
    label: "Fix Spelling & Grammar",
    icon: <Check className="h-4 w-4" />,
    prompt: "Fix any spelling and grammar errors in the following text:",
    category: "edit",
  },
  {
    id: "shorten",
    label: "Make Shorter",
    icon: <Minimize2 className="h-4 w-4" />,
    prompt:
      "Make the following text more concise while keeping the key points:",
    category: "edit",
  },
  {
    id: "extend",
    label: "Make Longer",
    icon: <Maximize2 className="h-4 w-4" />,
    prompt: "Expand on the following text with more details and context:",
    category: "edit",
  },
  {
    id: "simplify",
    label: "Simplify Language",
    icon: <Type className="h-4 w-4" />,
    prompt: "Simplify the following text to make it easier to understand:",
    category: "edit",
  },
  {
    id: "summarize",
    label: "Summarize",
    icon: <FileText className="h-4 w-4" />,
    prompt: "Provide a brief summary of the following text:",
    category: "write",
  },
  {
    id: "emojify",
    label: "Add Emojis",
    icon: <Smile className="h-4 w-4" />,
    prompt: "Add relevant emojis to enhance the following text:",
    category: "edit",
  },
  {
    id: "translate",
    label: "Translate",
    icon: <Languages className="h-4 w-4" />,
    prompt: "Translate the following text to",
    category: "translate",
  },
];

const LANGUAGES = [
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
];

const TONES = [
  "Professional",
  "Casual",
  "Friendly",
  "Formal",
  "Confident",
  "Empathetic",
  "Humorous",
  "Persuasive",
];

export function AiMenu() {
  const {
    state,
    updateState,
    reset,
    setGeneratedContent,
    setIsLoading,
    setError,
  } = useAi();
  const { editor } = useToolbar();
  const [customPrompt, setCustomPrompt] = useState("");
  const [showLanguages, setShowLanguages] = useState(false);
  const [showTones, setShowTones] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Spanish");
  const [selectedTone, setSelectedTone] = useState("Professional");
  const textareaRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (state.isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [state.isOpen]);

  // Close menu on escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && state.isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state.isOpen]);

  const handleClose = useCallback(() => {
    reset();
    setCustomPrompt("");
    setShowLanguages(false);
    setShowTones(false);
  }, [reset]);

  const executeAiAction = useCallback(
    async (action, additionalContext) => {
      if (!editor) return;

      setIsLoading(true);
      setError(null);

      const actionItem = AI_ACTIONS.find((a) => a.id === action);
      let prompt = "";

      if (action === "custom") {
        prompt = customPrompt;
      } else if (action === "translate") {
        prompt = `${actionItem?.prompt} ${
          additionalContext || selectedLanguage
        }:`;
      } else if (action === "tone") {
        prompt = `Rewrite the following text in a ${
          additionalContext || selectedTone
        } tone:`;
      } else {
        prompt = actionItem?.prompt || "";
      }

      const textToProcess = state.selectedText || editor.getText();

      try {
        const response = await fetch("/api/ai/editor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            text: textToProcess,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate AI content");
        }

        const data = await response.json();
        setGeneratedContent(data.content);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [
      editor,
      customPrompt,
      selectedLanguage,
      selectedTone,
      state.selectedText,
      setIsLoading,
      setError,
      setGeneratedContent,
    ]
  );

  const handleAccept = useCallback(() => {
    if (!editor || !state.generatedContent) return;

    const { from, to, empty } = editor.state.selection;

    if (empty) {
      // Insert at cursor position
      editor.chain().focus().insertContent(state.generatedContent).run();
    } else {
      // Replace selected text
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(state.generatedContent)
        .run();
    }

    handleClose();
  }, [editor, state.generatedContent, handleClose]);

  const handleRegenerate = useCallback(() => {
    if (customPrompt) {
      executeAiAction("custom");
    }
  }, [customPrompt, executeAiAction]);

  const handleDiscard = useCallback(() => {
    setGeneratedContent("");
    setError(null);
  }, [setGeneratedContent, setError]);

  const handleCustomSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (customPrompt.trim()) {
        executeAiAction("custom");
      }
    },
    [customPrompt, executeAiAction]
  );

  if (!state.isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <Card
        ref={menuRef}
        className="w-full max-w-lg mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Ask AI
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {state.selectedText && (
            <div className="mt-2 rounded-md bg-muted p-2 text-sm text-muted-foreground">
              <span className="font-medium">Selected text:</span>{" "}
              {state.selectedText.length > 100
                ? `${state.selectedText.slice(0, 100)}...`
                : state.selectedText}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Custom Prompt Input */}
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ask AI to help with your content..."
              className="min-h-[80px] resize-none"
              disabled={state.isLoading}
            />
          </div>
          <Button
            onClick={handleCustomSubmit}
            disabled={!customPrompt.trim() || state.isLoading}
            className="mt-2 w-full bg-purple-600 hover:bg-purple-700"
          >
            {state.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>

          {/* AI Actions */}
          {!state.generatedContent && !state.isLoading && (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Quick Actions
                </p>
                <ScrollArea className="h-[200px]">
                  <div className="grid grid-cols-2 gap-2 pr-4">
                    {AI_ACTIONS.filter((a) => a.id !== "translate").map(
                      (action) => (
                        <Button
                          key={action.id}
                          variant="outline"
                          size="sm"
                          className="justify-start gap-2 bg-transparent"
                          onClick={() => executeAiAction(action.id)}
                          disabled={state.isLoading}
                        >
                          {action.icon}
                          {action.label}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start gap-2 bg-transparent"
                      onClick={() => setShowTones(!showTones)}
                      disabled={state.isLoading}
                    >
                      <Type className="h-4 w-4" />
                      Adjust Tone
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start gap-2 bg-transparent"
                      onClick={() => setShowLanguages(!showLanguages)}
                      disabled={state.isLoading}
                    >
                      <Languages className="h-4 w-4" />
                      Translate
                    </Button>
                  </div>

                  {/* Tone Selection */}
                  {showTones && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium">Select Tone</p>
                      <div className="flex flex-wrap gap-1">
                        {TONES.map((tone) => (
                          <Button
                            key={tone}
                            variant={
                              selectedTone === tone ? "default" : "outline"
                            }
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              setSelectedTone(tone);
                              executeAiAction("tone", tone);
                              setShowTones(false);
                            }}
                          >
                            {tone}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Language Selection */}
                  {showLanguages && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium">Select Language</p>
                      <div className="flex flex-wrap gap-1">
                        {LANGUAGES.map((lang) => (
                          <Button
                            key={lang}
                            variant={
                              selectedLanguage === lang ? "default" : "outline"
                            }
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              setSelectedLanguage(lang);
                              executeAiAction("translate", lang);
                              setShowLanguages(false);
                            }}
                          >
                            {lang}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </>
          )}

          {/* Loading State */}
          {state.isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          )}

          {/* Error State */}
          {state.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          {/* Generated Content */}
          {state.generatedContent && !state.isLoading && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Generated Content
              </p>
              <div className="rounded-md border bg-muted/50 p-3">
                <ScrollArea className="max-h-[200px]">
                  <p className="whitespace-pre-wrap text-sm">
                    {state.generatedContent}
                  </p>
                </ScrollArea>
              </div>
            </div>
          )}
        </CardContent>

        {/* Action Buttons */}
        {state.generatedContent && !state.isLoading && (
          <CardFooter className="flex justify-between gap-2 pt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscard}
              className="gap-1 bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              Discard
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                className="gap-1 bg-transparent"
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="gap-1 bg-purple-600 hover:bg-purple-700"
              >
                <Check className="h-4 w-4" />
                Accept
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
