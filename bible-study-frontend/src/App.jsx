import ChatLayout from "./components/chat/ChatLayout";
import ThemeToggle from "./components/ui/ThemeToggle";
import { useEffect, useRef } from "react";
import { useChatStore } from "./app/store";

export default function App() {
  const bottomRef = useRef(null);
  const { messages } = useChatStore();

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 dark:bg-gray-900 transition-colors duration-300">

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-primary">
            📖 Bible Study Assistant
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Explore Scripture, People, Places & Events
          </p>
        </div>

        <ThemeToggle />
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <ChatLayout />
        <div ref={bottomRef} />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 text-center py-3 px-4 border-t dark:border-gray-700">
        <p>
          This tool is designed to assist Bible study. Please consult
          Scripture and church leadership for doctrinal guidance.
        </p>
      </footer>
    </div>
  );
}