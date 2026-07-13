"use client";

import { createContext, useContext, useState, useCallback } from "react";

const AiContext = createContext(null);

export function AiProvider({
  children,
  initialState = {
    selectedText: "",
    generatedContent: "",
    isLoading: false,
    error: null,
  },
}) {
  const [state, setState] = useState(initialState);

  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const setSelectedText = useCallback((text) => {
    setState((prev) => ({ ...prev, selectedText: text }));
  }, []);

  const setGeneratedContent = useCallback((content) => {
    setState((prev) => ({ ...prev, generatedContent: content }));
  }, []);

  const setIsLoading = useCallback((loading) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  return (
    <AiContext.Provider
      value={{
        state,
        updateState,
        reset,
        setSelectedText,
        setGeneratedContent,
        setIsLoading,
        setError,
      }}
    >
      {children}
    </AiContext.Provider>
  );
}

export function useAi() {
  const context = useContext(AiContext);
  if (!context) {
    throw new Error("useAi must be used within an AiProvider");
  }
  return context;
}
