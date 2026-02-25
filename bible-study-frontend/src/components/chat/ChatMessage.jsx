import ReactMarkdown from "react-markdown";
import VerseCard from "../entities/VerseCard";
import PersonCard from "../entities/PersonCard";
import PlaceCard from "../entities/PlaceCard";
import EventCard from "../entities/EventCard";
import TypingIndicator from "./TypingIndicator";

export default function ChatMessage({ message }) {
  // USER MESSAGE
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-primary text-white px-4 py-3 rounded-2xl max-w-xl shadow">
          {message.content}
        </div>
      </div>
    );
  }

  // ASSISTANT MESSAGE
  const data = message.content;

  if (!data) return null;

  const { summary, database_details } = data;

  return (
    <div className="flex justify-start">
      <div className="bg-white dark:bg-gray-800 px-5 py-4 rounded-2xl max-w-3xl shadow space-y-4">

        {/* SUMMARY */}
        {summary && (
          <div className="text-gray-800 dark:text-gray-200">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        )}

        {/* DATABASE DETAILS RENDER */}
        {database_details &&
          Object.entries(database_details).map(([key, value]) => {
            // NULL case (invalid verse etc)
            if (!value) {
              return (
                <div
                  key={key}
                  className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg"
                >
                  No record found for "{key}"
                </div>
              );
            }

            // VERSE detection
            if (value.verseText) {
              return <VerseCard key={key} data={value} />;
            }

            // PEOPLE detection
            if (value.birthyear !== undefined || value.gender) {
              return <PersonCard key={key} data={value} />;
            }

            // PLACE detection
            if (value.featuretype) {
              return <PlaceCard key={key} data={value} />;
            }

            // EVENT detection
            if (value.title && value.startdate) {
              return <EventCard key={key} data={value} />;
            }

            return null;
          })}
      </div>
    </div>
  );
}