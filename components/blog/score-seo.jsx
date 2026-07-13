"use client";

import { useWatch, useFormContext } from "react-hook-form";
import { CheckCircle, AlertTriangle, XCircle, Star } from "lucide-react";

const SEO_TIPS = {
  headline: [
    "Ideal length: 45–60 characters",
    "Use numbers (e.g., '7 Tips, 7 Ways') to increase click-through rates",
    "Include power words'like 'Proven', 'Best', or 'Secret'.",
  ],
  metaTitle: [
    "Keep it under 60 characters to avoid being cut off in google results",
    "Place your primary keyword near the beginning",
    "Include your brand name at the end (e.g., ' | YourBrand').",
  ],
  description: [
    "Ideal length: 120–160 characters",
    "Include a clear Call to Action (e.g., 'Learn more', 'Get started').",
    "Summrize the page content to improve click-through rates.",
  ],
};

/**
 * Generic SEO Scorer for Headlines, Meta Titles, and Descriptions
 * @param {string} text - The content to score
 * @param {string} type - 'headline', 'metaTitle', or 'description'
 */
function scoreContent(text, type = "headline") {
  if (!text) {
    return { score: 0, label: "Empty", color: "gray", length: 0 };
  }

  const length = text.length;
  let score = 0;

  // 1. Define Rules based on Type
  const rules = {
    headline: {
      ideal: [45, 60],
      acceptable: [30, 70],
      weightLength: 40,
      checkPowerWords: true,
      checkNumbers: true,
      checkQuestions: true,
    },
    metaTitle: {
      ideal: [50, 60],
      acceptable: [30, 65],
      weightLength: 50, // Length is more critical for titles
      checkPowerWords: true,
      checkNumbers: false,
      checkQuestions: false,
    },
    description: {
      ideal: [120, 160],
      acceptable: [70, 165],
      weightLength: 70, // Descriptions are mostly about length
      checkPowerWords: true,
      checkNumbers: false,
      checkQuestions: false,
    },
  };

  const config = rules[type] || rules.headline;

  // 2. Length Scoring
  if (length >= config.ideal[0] && length <= config.ideal[1]) {
    score += config.weightLength;
  } else if (length >= config.acceptable[0] && length <= config.acceptable[1]) {
    score += config.weightLength * 0.6; // Partial points
  } else {
    score += 10;
  }

  // 3. Bonus Scoring
  const bonuses = [];

  // Power words (20 points)
  if (config.checkPowerWords) {
    const powerWords = [
      "best",
      "free",
      "new",
      "easy",
      "proven",
      "secret",
      "limited",
      "get",
    ];
    if (powerWords.some((w) => text.toLowerCase().includes(w))) {
      score += 20;
    }
  }

  // Numbers (20 points)
  if (config.checkNumbers && /\d/.test(text)) {
    score += 20;
  }

  // Questions (10 or 20 points depending on remaining weight)
  if (config.checkQuestions && text.includes("?")) {
    score += 20;
  }

  // 4. Cap and Color Logic
  if (score > 100) score = 100;

  let label = "Poor";
  let color = "red";

  if (score >= 80) {
    label = "Excellent";
    color = "green";
  } else if (score >= 60) {
    label = "Good";
    color = "yellow";
  } else if (score >= 40) {
    label = "Average";
    color = "orange";
  }

  return { score: Math.round(score), label, color, length };
}

export function SeoScorePanel({ name, primaryFieldName, title, type }) {
  const { control, setValue } = useFormContext();

  const fieldData = useWatch({ control, name: name });
  const primaryIndex = useWatch({ control, name: primaryFieldName }) ?? null;
  const items = Array.isArray(fieldData) ? fieldData : [fieldData];

  const results = items?.map((text, index) => ({
    index,
    text,
    length: text?.length || 0,
    ...scoreContent(text, type),
  }));

  const best =
    results.length > 0
      ? results.reduce((a, b) => (b.score > a.score ? b : a))
      : null;

  const activeTips = SEO_TIPS[type] || SEO_TIPS.headline;

  if (!fieldData || (Array.isArray(fieldData) && !fieldData.length)) {
    return (
      <div className="border rounded-lg p-4 bg-white text-sm text-gray-500">
        Add {title.toLowerCase()} to see SEO scores here.
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white space-y-4">
      <h3 className="font-semibold text-gray-900">Headline SEO Scores</h3>

      {results.map((item) => {
        const isBest = best && item.index === best.index;
        const isPrimary = primaryIndex === item.index;

        return (
          <div
            key={item.index}
            className={`border rounded-md p-3 space-y-2 ${
              isBest ? "border-green-400 bg-green-50" : "border-gray-200"
            }`}
          >
            {/* Headline row */}
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-gray-800 flex-1">
                {item.text || "Empty headline"}
              </p>

              {/* Best badge */}
              {isBest && (
                <span className="flex items-center gap-1 text-xs text-green-700 font-medium">
                  <Star className="w-4 h-4 fill-green-500 text-green-500" />
                  Best
                </span>
              )}
            </div>

            {/* Score bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${item.score}%`,
                    background:
                      item.color === "green"
                        ? "#22c55e"
                        : item.color === "yellow"
                        ? "#eab308"
                        : item.color === "orange"
                        ? "#f97316"
                        : "#ef4444",
                  }}
                />
              </div>

              <span className="text-sm font-medium">{item.score}/100</span>
            </div>

            {/* Status row */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {item.color === "green" && (
                  <CheckCircle className="text-green-500 w-4 h-4" />
                )}
                {item.color === "yellow" && (
                  <AlertTriangle className="text-yellow-500 w-4 h-4" />
                )}
                {item.color === "orange" && (
                  <AlertTriangle className="text-orange-500 w-4 h-4" />
                )}
                {item.color === "red" && (
                  <XCircle className="text-red-500 w-4 h-4" />
                )}

                <span>
                  {item.label} — {item.length} chars
                </span>
              </div>

              {/* Select as primary */}
              <button
                type="button"
                onClick={() => setValue("primaryHeadline", item.index)}
                className={`text-xs px-2 py-1 rounded border ${
                  isPrimary
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {isPrimary ? "Primary" : "Set Primary"}
              </button>
            </div>
          </div>
        );
      })}

      {/* Dynamic Global tips */}
      <div className="pt-2 border-t border-indigo-200">
        <h4 className="font-semibold text-gray-900 mb-2 uppercase tracking-tight">
          SEO Tips:
        </h4>
        <ul className="space-y-1">
          {activeTips.map((tip, i) => (
            <li
              key={i}
              className="text-xs text-gray-500 flex items-start gap-2"
            >
              <span className="text-indigo-400">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
