import { useEffect, useState } from "react";

export default function TypingIndicator({
  text = "",
  speed = 15,          // ms per character
  showCursor = true,   // blinking cursor
  onComplete = null,   // callback after typing finishes
}) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!text) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayed("");
    setIndex(0);

    let interval;

    interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(index));
      setIndex((prev) => prev + 1);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, index]);

  useEffect(() => {
    if (index >= text.length && onComplete) {
      onComplete();
    }
  }, [index, text.length, onComplete]);

  return (
    <span className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
      {displayed}
      {showCursor && index < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}