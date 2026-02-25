import ReactMarkdown from "react-markdown";
import { FiCopy } from "react-icons/fi";
import { useState } from "react";

export default function VerseCard({ data }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const {
    osisRef,
    verseText,
    mdText,
    book,
    chapter,
    verseNum,
  } = data;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${osisRef}\n${verseText}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 p-5 rounded-2xl shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg text-amber-800 dark:text-amber-300">
          {osisRef || `${book} ${chapter}:${verseNum}`}
        </h3>

        <button
          onClick={handleCopy}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
          aria-label="Copy verse"
        >
          <FiCopy />
        </button>
      </div>

      {/* Verse Text */}
      <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-100 leading-relaxed">
        <ReactMarkdown>
          {mdText || verseText || "Verse text not available."}
        </ReactMarkdown>
      </div>

      {/* Footer Info */}
      {copied && (
        <div className="mt-3 text-sm text-green-600 dark:text-green-400">
          ✓ Verse copied to clipboard
        </div>
      )}
    </div>
  );
}