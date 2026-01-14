import { Calendar, MapPin } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";

interface EventItem {
  id: number;
  name: string;
  date: string;
  locationName: string;
}

interface NextEventsListProps {
  events: EventItem[];
}

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

const getDaysUntilEvent = (date: string) => {
  const today = new Date();
  const eventDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diffTime = eventDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getEventBadge = (days: number) => {
  if (days < 0) return null;

  if (days === 0) {
    return <Badge color="error">Hoje</Badge>;
  }

  if (days <= 5) {
    return <Badge color="warning">Em {days} dias</Badge>;
  }

  if (days == 10) {
    return <Badge color="info">Em 10 dias</Badge>;
  }

  if (days == 15) {
    return <Badge color="success">Em 15 dias</Badge>;
  }

  return null;
};

export default function NextEventsList({ events }: NextEventsListProps) {
  const sortedEvents = [...events].sort((a, b) => {
    const daysA = getDaysUntilEvent(a.date);
    const daysB = getDaysUntilEvent(b.date);
    return daysA - daysB;
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Próximos eventos
      </h3>

      <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar pr-1">
        {sortedEvents.map((event) => {
          const daysUntil = getDaysUntilEvent(event.date);
          return (
            <div
              key={event.id}
              className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-gray-800 dark:text-white">
                  {event.name}
                </span>

                {getEventBadge(daysUntil)}
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
          );
        })}

        {sortedEvents.length === 0 && (
          <p className="text-sm text-gray-500">
            Nenhum evento futuro.
          </p>
        )}
      </div>
    </div>
  );
}
