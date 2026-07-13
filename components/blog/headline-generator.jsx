"use client";
import { useCompletion } from "@ai-sdk/react";
import React from "react";

export default function HeadlineGenerator({ content, onHeadlinesGenerated }) {
  const { complete, isLoading } = useCompletion({
    api: "api/completions",
    model: "gpt-4o",
    prompt: `Generate 5 catchy blog post headlines based on the following content:\n\n${content}\n\nHeadlines:`,
    maxTokens: 150,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    onComplete: (completion) => {
      const headlines = completion.text
        .split("\n")
        .filter((line) => line.trim() !== "");
      onHeadlinesGenerated(headlines);
    },
  });

  const generateHeadlines = async () => {
    // we send the first 500 words of the blog to the AI to generate headlines
    const result = await complete(content.substring(0, 3000));
    if (result) {
      // Logic to split the AI reponse into a array of headlines
      const suggestedHeadlines = result.text
        .split("\n")
        .filter((line) => line.trim() !== "");
      onHeadlinesGenerated(suggestedHeadlines);
    }
  };
  return (
    <div>
      <button onClick={generateHeadlines} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Headlines"}
      </button>
    </div>
  );
}
