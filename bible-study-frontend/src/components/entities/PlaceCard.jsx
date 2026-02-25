import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FiMapPin, FiExternalLink } from "react-icons/fi";
import "leaflet/dist/leaflet.css";

export default function PlaceCard({ data }) {
  const [expanded, setExpanded] = useState(false);

  if (!data) return null;

  const {
    displaytitle,
    featuretype,
    featuresubtype,
    dicttext,
    latitude,
    longitude,
    versecount,
  } = data;

  const hasCoordinates = latitude && longitude;

  const shortText =
    dicttext && dicttext.length > 400
      ? dicttext.slice(0, 400) + "..."
      : dicttext;

  return (
    <div className="bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-700 p-5 rounded-2xl shadow-sm space-y-4">

      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
          <FiMapPin />
          {displaytitle}
        </h3>

        {(featuretype || featuresubtype) && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {featuretype}
            {featuresubtype && ` • ${featuresubtype}`}
          </p>
        )}

        {versecount && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mentioned in {versecount} verses
          </p>
        )}
      </div>

      {/* Description */}
      {dicttext && (
        <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
          <p>{expanded ? dicttext : shortText}</p>

          {dicttext.length > 400 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-green-700 dark:text-green-400 mt-2 underline"
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
      )}

      {/* Map Section */}
      {hasCoordinates ? (
        <div className="h-64 rounded-xl overflow-hidden">
          <MapContainer
            center={[latitude, longitude]}
            zoom={10}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latitude, longitude]}>
              <Popup>{displaytitle}</Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Location map not available.
        </div>
      )}

      {/* External Map Link */}
      {hasCoordinates && (
        <a
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 text-sm underline"
        >
          View on Google Maps
          <FiExternalLink />
        </a>
      )}
    </div>
  );
}