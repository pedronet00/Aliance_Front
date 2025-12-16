import { Calendar, MapPin } from "lucide-react";

interface EventItem {
  id: number;
  name: string;
  date: string;
  locationName: string;
}

interface LatestEventsListProps {
  events: EventItem[];
}

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

export default function LatestEventsList({ events }: LatestEventsListProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Próximos eventos
      </h3>

      <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar pr-1">
        {events.map(event => (
          <div
            key={event.id}
            className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800 dark:text-white">
                {event.name}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDateTime(event.date)}
              </span>

              {event.locationName && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {event.locationName}
                </span>
              )}
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <p className="text-sm text-gray-500">
            Nenhum evento recente.
          </p>
        )}
      </div>
    </div>
  );
}
