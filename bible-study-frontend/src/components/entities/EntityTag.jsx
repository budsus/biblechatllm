import { askQuestion } from "../../services/api";
import { useChatStore } from "../../app/store";
import clsx from "clsx";

export default function EntityTag({
  name,
  type = "default",   // people | place | verse | event
  className = "",
}) {
  const { addMessage, setLoading, loading } = useChatStore();

  const handleClick = async () => {
    if (loading) return;

    addMessage({ role: "user", content: name });
    setLoading(true);

    try {
      const data = await askQuestion(name);

      addMessage({
        role: "assistant",
        content: data,
      });
    } catch (error) {
      console.error("EntityTag API Error:", error);

      addMessage({
        role: "assistant",
        content: {
          summary:
            "Sorry, something went wrong while exploring this topic.",
          database_details: null,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const baseStyle =
    "cursor-pointer underline transition font-medium";

  const typeStyles = {
    people:
      "text-blue-600 dark:text-blue-400 hover:text-blue-800",
    place:
      "text-green-600 dark:text-green-400 hover:text-green-800",
    verse:
      "text-amber-600 dark:text-amber-400 hover:text-amber-800",
    event:
      "text-purple-600 dark:text-purple-400 hover:text-purple-800",
    default:
      "text-primary hover:opacity-80",
  };

  return (
    <span
      onClick={handleClick}
      className={clsx(baseStyle, typeStyles[type], className)}
      role="button"
      tabIndex={0}
      aria-label={`Explore ${name}`}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {name}
    </span>
  );
}