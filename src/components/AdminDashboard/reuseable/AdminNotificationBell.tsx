import React, { useState, useEffect } from "react";
import { FaRegBell } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  selectNotifications,
  clearNotifications,
  removeNotification,
} from "@/store/features/notifications/notification.slice";

const AdminNotificationBell: React.FC = () => {
  const notifications = useSelector(selectNotifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.length;

  console.log("🔔 Notification bell mounted, unread:", unreadCount);

  // Force re-log on count change (useEffect would need deps)
  useEffect(() => {
    console.log("🔔 Notification count changed:", unreadCount);
  }, [unreadCount]);

  // ✅ Call backend to mark as read, remove from Redux, navigate, show toast
  const handleNotificationClick = async (notif: any) => {
    console.log("👆 Notification clicked:", notif._id, "marking read...");
    setOpen(false);

    try {
      await fetch(`/api/report/mark-read/${notif._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
    } catch (err) {
      console.error("Failed to mark report as read:", err);
    }

    // ✅ Remove from Redux immediately (don't wait for socket echo)
    dispatch(removeNotification(notif._id));

    // ✅ Show toaster with context
    toast.info("New report received", {
      description: `${notif.name || "A user"} reported: ${notif.report?.text || ""}`,
      duration: 5000,
    });

    // ✅ Navigate directly to the report detail page
    navigate("/admin/support");
  };

  const handleMarkAllRead = async () => {
    // Fire mark-read for each notification in parallel
    await Promise.allSettled(
      notifications.map((notif: any) =>
        fetch(`/api/report/mark-read/${notif._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        })
      )
    );
    dispatch(clearNotifications());
    setOpen(false);
    toast.success("All notifications marked as read");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          <FaRegBell className="h-5 w-5 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[linear-gradient(103deg,#0076F5_6.94%,#0058B8_99.01%)] text-[10px] font-medium text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 bg-white border border-border p-0"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-800">
            Notifications
          </span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              No new notifications
            </div>
          ) : (
            notifications.map((notif: any, idx: number) => (
              <DropdownMenuItem
                key={`${notif._id}-${idx}`}
                className="cursor-pointer px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 focus:bg-gray-50"
                // ✅ Click → mark read + navigate + toast
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-600">
                      New Report
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {notif.createdAt
                        ? new Date(notif.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 line-clamp-2">
                    <span className="font-semibold">{notif.name}</span>{" "}
                    reported: {notif.report?.text}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    MCQ ID: {notif.report?.mcqId}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminNotificationBell;