"use client";

import { useWatch, useFormContext } from "react-hook-form";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(text) {
  if (!text) return 0;
  return text.split(/\s+/).length;
}

function countKeyword(text, keyword) {
  if (!text || !keyword) return 0;

  const regex = new RegExp(`\\b${keyword}\\b`, "gi");
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

export function KeywordDensityPanel() {
  const { control } = useFormContext();

  // Change "content" to your richtext field name
  const htmlContent = useWatch({ control, name: "content" }) || "";
  const focusKeyword = useWatch({ control, name: "focusKeyword" }) || "";
  console.log("htmlContent length:", htmlContent.html);

  const plainText = stripHtml(
    typeof htmlContent === "string" ? htmlContent : htmlContent.html || ""
  );
  const totalWords = countWords(plainText);
  const keywordCount = countKeyword(
    plainText.toLowerCase(),
    focusKeyword.toLowerCase()
  );

  const density =
    totalWords > 0 && keywordCount > 0
      ? ((keywordCount / totalWords) * 100).toFixed(2)
      : "0.00";

  // SEO Rules (basic, safe)
  let status = "Too Low";
  let color = "red";

  if (!focusKeyword) {
    status = "No keyword";
    color = "gray";
  } else if (density >= 0.5 && density <= 2.5) {
    status = "Good";
    color = "green";
  } else if (density > 2.5) {
    status = "Too High (Keyword stuffing)";
    color = "orange";
  } else {
    status = "Too Low";
    color = "red";
  }

  return (
    <div className="border rounded-lg p-4 bg-white space-y-3">
      <h3 className="font-semibold text-gray-900">Keyword Density</h3>

      {!focusKeyword ? (
        <p className="text-sm text-gray-500">
          Enter a focus keyword to analyze your content.
        </p>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Words</p>
              <p className="font-medium">{totalWords}</p>
            </div>

            <div>
              <p className="text-gray-500">Keyword Uses</p>
              <p className="font-medium">{keywordCount}</p>
            </div>

            <div>
              <p className="text-gray-500">Density</p>
              <p className="font-medium">{density}%</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 text-sm">
            {color === "green" && (
              <CheckCircle className="text-green-500 w-4 h-4" />
            )}
            {color === "orange" && (
              <AlertTriangle className="text-orange-500 w-4 h-4" />
            )}
            {color === "red" && <XCircle className="text-red-500 w-4 h-4" />}

            <span>{status}</span>
          </div>

          {/* Tips */}
          <ul className="text-xs text-gray-500 space-y-1 pt-2">
            <li>• Ideal density: 0.5% – 2.5%</li>
            <li>• Avoid keyword stuffing</li>
            <li>• Use keyword naturally in headings and paragraphs</li>
          </ul>
        </>
      )}
    </div>
  );
}
