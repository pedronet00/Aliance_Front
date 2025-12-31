import { useEffect, useMemo, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";
import apiClient from "@/api/apiClient";
import { BellIcon, TimerIcon, AlertTriangleIcon, Calendar1Icon, StarIcon } from "lucide-react";

type Notification = {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: number;
};

function getNotificationStyle(type: string) {
  switch (type) {
    case "Pendencias": // Pendencias
      return {
        icon: <TimerIcon/>,
        bg: "bg-yellow-100",
        text: "text-yellow-700",
      };
    case "Alerta": // Alerta
      return {
        icon: <AlertTriangleIcon/>,
        bg: "bg-red-100",
        text: "text-red-700",
      };
    case "Comunicados": // Comunicados
      return {
        icon: <StarIcon/>,
        bg: "bg-blue-100",
        text: "text-blue-700",
      };
    case "Eventos": // Eventos
      return {
        icon: <Calendar1Icon/>,
        bg: "bg-green-100",
        text: "text-green-700",
      };
    default:
      return {
        icon: <BellIcon/>,
        bg: "bg-gray-100",
        text: "text-gray-600",
      };
  }
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const hasUnread = useMemo(
    () => notifications.some((n) => !n.isRead),
    [notifications]
  );

  function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  async function loadNotifications() {
    setLoading(true);
    try {
      const { data } = await apiClient.get<Notification[]>("/notifications");
      setNotifications(data);
    } catch (err) {
      console.error("Erro ao carregar notificações", err);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notificationId: number) {
    try {
      await apiClient.post("/notifications/mark-as-read", {
        notificationId,
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Erro ao marcar como lida", err);
    }
  }

  async function markAllAsRead() {
    const unread = notifications.filter((n) => !n.isRead);

    await Promise.all(
      unread.map((n) =>
        apiClient.post("/notifications/mark-as-read", {
          notificationId: n.id,
        })
      )
    );

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center h-11 w-11 rounded-full border bg-white dark:bg-gray-900"
        onClick={toggleDropdown}
      >
        {hasUnread && (
          <span className="absolute right-0 top-0.5 h-2 w-2 rounded-full bg-orange-400">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
          </span>
        )}
        🔔
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-4 flex h-[480px] w-[360px] flex-col rounded-xl border bg-white p-3 shadow-lg"
      >

        <div className="flex items-center justify-between border-b pb-3 mb-3">
          <h5 className="font-semibold">Notificações</h5>

          {hasUnread && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:underline"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>

        <ul className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {loading && (
            <li className="p-4 text-sm text-gray-500">Carregando...</li>
          )}

          {!loading && notifications.length === 0 && (
            <li className="p-4 text-sm text-gray-500">
              Nenhuma notificação
            </li>
          )}

          {notifications.map((n) => {
            const style = getNotificationStyle(n.type);

            return (
              <li key={n.id}>
                <DropdownItem
                  className={`flex gap-3 border-b p-3 transition ${
                    n.isRead
                      ? "bg-white opacity-60"
                      : "bg-gray-50"
                  }`}
                >
                  {/* Ícone */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${style.bg} ${style.text}`}
                  >
                    <span className="text-lg">{style.icon}</span>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex justify-between gap-2">
                      <span
                        className={`text-sm font-medium ${
                          n.isRead
                            ? "text-gray-600"
                            : "text-gray-900"
                        }`}
                      >
                        {n.title}
                      </span>
                    </div>

                    <span
                      className={`text-sm ${
                        n.isRead
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      {n.message}
                    </span>

                    <span className="text-xs text-gray-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>

                    {!n.isRead && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Marcar como lida
                        </button>
                      )}
                  </div>
                </DropdownItem>
              </li>
            );
          })}
        </ul>

        <Link
          to="/notifications"
          className="block mt-3 text-center text-sm border rounded-lg py-2 hover:bg-gray-100"
        >
          Ver todas
        </Link>
      </Dropdown>
    </div>
  );
}
