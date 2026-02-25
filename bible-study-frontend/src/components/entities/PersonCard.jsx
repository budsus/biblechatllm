import { useState } from "react";
import { FiUser, FiUsers } from "react-icons/fi";

export default function PersonCard({ data }) {
  const [expanded, setExpanded] = useState(false);

  if (!data) return null;

  const {
    displaytitle,
    name,
    gender,
    birthyear,
    deathyear,
    minyear,
    maxyear,
    versecount,
    dicttext,
    mother,
    father,
    children,
    partners,
  } = data;

  const title = displaytitle || name;

  const shortBio =
    dicttext && dicttext.length > 500
      ? dicttext.slice(0, 500) + "..."
      : dicttext;

  const formatYear = (year) => {
    if (!year) return null;
    if (year < 0) return `${Math.abs(year)} BC`;
    return `${year} AD`;
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 p-5 rounded-2xl shadow-sm space-y-4">

      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
          <FiUser />
          {title}
        </h3>

        {gender && (
          <span className="text-xs bg-blue-200 dark:bg-blue-700 px-2 py-1 rounded-full text-blue-800 dark:text-blue-200">
            {gender}
          </span>
        )}

        {versecount && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Mentioned in {versecount} verses
          </p>
        )}

        {/* Lifespan */}
        {(birthyear || deathyear) && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formatYear(birthyear || minyear)}{" "}
            {deathyear && `– ${formatYear(deathyear || maxyear)}`}
          </p>
        )}
      </div>

      {/* Biography */}
      {dicttext && (
        <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
          <p>{expanded ? dicttext : shortBio}</p>

          {dicttext.length > 500 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-blue-700 dark:text-blue-400 mt-2 underline"
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
      )}

      {/* Family Section */}
      {(mother || father || children || partners) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-2">
          <h4 className="font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <FiUsers />
            Family
          </h4>

          {mother && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Mother:</strong> {mother}
            </p>
          )}

          {father && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Father:</strong> {father}
            </p>
          )}

          {partners && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Spouse:</strong> {partners}
            </p>
          )}

          {children && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Children:</strong> {children}
            </p>
          )}
        </div>
      )}
    </div>
  );
}