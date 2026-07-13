"use client";

import { useWatch, useFormContext } from "react-hook-form";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

function scoreHeadlineSimple(text) {
  if (!text) return 0;
  let score = 0;
  const len = text.length;

  if (len >= 45 && len <= 60) score += 40;
  else if (len >= 30 && len <= 70) score += 25;
  else score += 10;

  if (/\d/.test(text)) score += 20;
  if (text.includes("?")) score += 10;

  if (score > 100) score = 100;
  return score;
}

export function FinalSeoSummary() {
  const { control } = useFormContext();

  const headlines = useWatch({ control, name: "headlines" }) || [];
  const primaryIndex = useWatch({ control, name: "primaryHeadline" }) ?? 0;

  const metaTitle = useWatch({ control, name: "metaTitle" }) || "";
  const metaDescription = useWatch({ control, name: "metaDescription" }) || "";

  const selectedHeadline = headlines[primaryIndex] || headlines[0] || "";

  const headlineScore = scoreHeadlineSimple(selectedHeadline);

  let totalScore = 0;

  // Headline (40%)
  totalScore += headlineScore * 0.4;

  // Meta title (30%)
  if (metaTitle.length >= 45 && metaTitle.length <= 60) totalScore += 30;
  else if (metaTitle.length > 0) totalScore += 15;

  // Meta description (30%)
  if (metaDescription.length >= 120 && metaDescription.length <= 160)
    totalScore += 30;
  else if (metaDescription.length > 0) totalScore += 15;

  totalScore = Math.round(totalScore);

  let status = "Poor";
  let color = "red";

  if (totalScore >= 80) {
    status = "Excellent";
    color = "green";
  } else if (totalScore >= 60) {
    status = "Good";
    color = "yellow";
  } else if (totalScore >= 40) {
    status = "Average";
    color = "orange";
  }

  return (
    <div className="border rounded-lg p-4 bg-white space-y-3">
      <h3 className="font-semibold text-gray-900">Final SEO Readiness</h3>

      {/* Overall score */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${totalScore}%`,
              background:
                color === "green"
                  ? "#22c55e"
                  : color === "yellow"
                  ? "#eab308"
                  : color === "orange"
                  ? "#f97316"
                  : "#ef4444",
            }}
          />
        </div>

        <span className="text-lg font-semibold">{totalScore}/100</span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-sm">
        {color === "green" && (
          <CheckCircle className="text-green-500 w-4 h-4" />
        )}
        {color === "yellow" && (
          <AlertTriangle className="text-yellow-500 w-4 h-4" />
        )}
        {color === "orange" && (
          <AlertTriangle className="text-orange-500 w-4 h-4" />
        )}
        {color === "red" && <XCircle className="text-red-500 w-4 h-4" />}

        <span>{status} — Ready to publish</span>
        {selectedHeadline.length >= 45 && selectedHeadline.length <= 60 ? (
          <span className="ml-auto text-xs text-green-600">
            Primary headline length optimal
          </span>
        ) : (
          <span className="ml-auto text-xs text-red-500">
            Primary headline length suboptimal
          </span>
        )}
      </div>

      {/* Checklist */}
      <ul className="text-xs space-y-1 pt-2">
        <li
          className={
            selectedHeadline.length >= 45 && selectedHeadline.length <= 60
              ? "text-green-600"
              : "text-red-500"
          }
        >
          • Primary headline length optimized
        </li>

        <li
          className={
            metaTitle.length >= 45 && metaTitle.length <= 60
              ? "text-green-600"
              : "text-red-500"
          }
        >
          • Meta title optimized
        </li>

        <li
          className={
            metaDescription.length >= 120 && metaDescription.length <= 160
              ? "text-green-600"
              : "text-red-500"
          }
        >
          • Meta description optimized
        </li>
      </ul>
    </div>
  );
}
