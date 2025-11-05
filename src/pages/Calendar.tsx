import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import apiClient from "@/api/apiClient";
import { showErrorToast } from "@/components/toast/Toasts";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    const fetchCalendarItems = async () => {
      try {
        const response = await apiClient.get("/Calendar"); // rota da nova service
        if (response.data?.hasResult && Array.isArray(response.data.result)) {
          const formattedEvents = response.data.result.map((item: any) => ({
            title: item.title,
            start: item.date,
            extendedProps: {
              calendar:
                item.type === "Evento"
                  ? "primary"
                  : item.type === "Culto"
                  ? "success"
                  : "default",
            },
          }));
          setEvents(formattedEvents);
        } else {
          setEvents([]);
        }
      } catch (error: any) {
        showErrorToast("Falha ao carregar eventos e cultos.");
      }
    };

    fetchCalendarItems();
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent(clickInfo.event as unknown as CalendarEvent);
    openModal();
  };

  return (
    <>
      <PageMeta
        title="Calendário de Eventos e Cultos"
        description="Visualize os eventos e cultos da igreja"
      />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4">
        {/* Calendário reduzido */}
        <div className="custom-calendar scale-90 origin-top max-h-[600px] overflow-y-auto text-sm">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            aspectRatio={1.3}
            locale="pt-br"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
          />
        </div>

        {/* Modal informativo */}
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[600px] p-6 lg:p-8"
        >
          {selectedEvent && (
            <div className="flex flex-col gap-6 px-2 text-sm">
              <div>
                <h5 className="font-semibold text-gray-800 dark:text-white/90 text-xl mb-2">
                  {selectedEvent.title}
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Detalhes do evento
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Data
                  </label>
                  <p className="text-gray-800 dark:text-gray-200 font-semibold">
                    {selectedEvent.start
                      ? new Date(selectedEvent.start).toLocaleDateString("pt-BR")
                      : "-"}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Categoria
                  </label>
                  <span
                    className="text-gray-800 dark:text-gray-200 font-semibold"
                  >
                    {selectedEvent.extendedProps.calendar === "primary"
                      ? "Evento"
                      : selectedEvent.extendedProps.calendar === "success"
                      ? "Culto"
                      : "Outro"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={closeModal}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const colorClass =
    eventInfo.event.extendedProps.calendar?.toLowerCase() || "primary";
  return (
    <div
      className={`flex items-center p-1 rounded-sm border-l-4 border-${colorClass}-500`}
      style={{ maxWidth: "100%" }} // garante que o container não ultrapasse a célula
    >
      <div
        className="ml-1 text-xs text-gray-800 dark:text-gray-100 overflow-hidden whitespace-nowrap text-ellipsis"
        style={{ maxWidth: "calc(100% - 0.25rem)" }} // pequeno padding interno
      >
        {eventInfo.event.title}
      </div>
    </div>
  );
};



export default Calendar;
