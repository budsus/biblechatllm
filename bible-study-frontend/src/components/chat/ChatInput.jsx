import { useState, useRef } from "react";
import { askQuestion } from "../../services/api";
import { useChatStore } from "../../app/store";
import { FiSend } from "react-icons/fi";

export default function ChatInput() {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const { addMessage, setLoading, loading } = useChatStore();

  const examples = [
    "What does John 3:16 mean?",
    "Who was Abraham?",
    "Explain the Crucifixion.",
    "Where is Bethlehem?",
  ];

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    // Add user message
    addMessage({ role: "user", content: trimmed });

    setLoading(true);

    try {
      const data = await askQuestion(trimmed);

      addMessage({
        role: "assistant",
        content: data,
      });
    } catch (error) {
      console.error("API Error:", error);

      addMessage({
        role: "assistant",
        content: {
          summary:
            "Sorry, something went wrong while processing your request. Please try again.",
          database_details: null,
        },
      });
    } finally {
      setLoading(false);
      setText("");
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleExampleClick = (example) => {
    setText(example);
    textareaRef.current?.focus();
  };

  return (
    <div className="mt-8">
      {/* Example Questions */}
      <div className="mb-4 flex flex-wrap gap-2">
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => handleExampleClick(ex)}
            className="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-end gap-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-3 shadow-sm">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Scripture, people, places, or events..."
          aria-label="Bible study question input"
          disabled={loading}
          className="flex-1 resize-none outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`p-3 rounded-xl transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-blue-800 text-white"
          }`}
          aria-label="Send message"
        >
          <FiSend />
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-3 text-sm text-gray-500 animate-pulse">
          Studying Scripture...
        </div>
      )}
    </div>
  );
}