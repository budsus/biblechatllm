import { useState } from "react";
import { FiCalendar, FiClock, FiUsers, FiMapPin } from "react-icons/fi";

export default function EventCard({ data }) {
  const [showVerses, setShowVerses] = useState(false);

  if (!data) return null;

  const {
    title,
    startdate,
    duration,
    partof,
    predecessor,
    verses,
    participants,
    locations,
  } = data;

  // Split verses into array (if comma-separated)
  const verseList = verses ? verses.split(",") : [];

  return (
    <div className="bg-purple-50 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-700 p-5 rounded-2xl shadow-sm space-y-4">

      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-300">
          {title}
        </h3>

        {partof && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Part of: {partof}
          </p>
        )}
      </div>

      {/* Timeline Info */}
      <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
        {startdate && (
          <p className="flex items-center gap-2">
            <FiCalendar />
            Date: {startdate}
          </p>
        )}

        {duration && (
          <p className="flex items-center gap-2">
            <FiClock />
            Duration: {duration}
          </p>
        )}

        {predecessor && (
          <p>
            <strong>Preceded by:</strong> {predecessor}
          </p>
        )}
      </div>

      {/* Participants */}
      {participants && (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p className="flex items-center gap-2 font-medium">
            <FiUsers />
            Participants:
          </p>
          <p className="ml-6">{participants}</p>
        </div>
      )}

      {/* Locations */}
      {locations && (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p className="flex items-center gap-2 font-medium">
            <FiMapPin />
            Location:
          </p>
          <p className="ml-6">{locations}</p>
        </div>
      )}

      {/* Verses */}
      {verseList.length > 0 && (
        <div>
          <button
            onClick={() => setShowVerses(!showVerses)}
            className="text-sm text-purple-700 dark:text-purple-400 underline"
          >
            {showVerses ? "Hide Related Verses" : "Show Related Verses"}
          </button>

          {showVerses && (
            <div className="mt-3 flex flex-wrap gap-2">
              {verseList.map((v, index) => (
                <span
                  key={index}
                  className="text-xs bg-purple-200 dark:bg-purple-700 px-2 py-1 rounded-full text-purple-800 dark:text-purple-200 cursor-pointer hover:opacity-80 transition"
                >
                  {v}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}