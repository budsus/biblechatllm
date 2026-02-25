import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useChatStore } from "../../app/store";

export default function ChatLayout() {
  const { messages } = useChatStore();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
      </div>
      <ChatInput />
    </div>
  );
}