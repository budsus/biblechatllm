import clsx from "clsx";

export default function Timeline({
  items = [],         // array of timeline items
  activeIndex = null, // highlight active event
  onSelect = null,    // callback when item clicked
}) {
  if (!items.length) return null;

  return (
    <div className="relative border-l-2 border-gray-300 dark:border-gray-600 pl-6 space-y-8">

      {items.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={index}
            className="relative cursor-pointer"
            onClick={() => onSelect && onSelect(item, index)}
          >
            {/* Dot */}
            <div
              className={clsx(
                "absolute -left-[11px] w-5 h-5 rounded-full border-2",
                isActive
                  ? "bg-primary border-primary"
                  : "bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-500"
              )}
            />

            {/* Content */}
            <div
              className={clsx(
                "p-4 rounded-xl shadow-sm transition",
                isActive
                  ? "bg-primary text-white"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              )}
            >
              {item.date && (
                <p className="text-xs opacity-70 mb-1">
                  {item.date}
                </p>
              )}

              <h4 className="font-semibold text-lg">
                {item.title}
              </h4>

              {item.subtitle && (
                <p className="text-sm opacity-80">
                  {item.subtitle}
                </p>
              )}

              {item.description && (
                <p className="mt-2 text-sm leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}