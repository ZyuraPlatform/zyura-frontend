import CommonWrapper from "@/common/CommonWrapper";
import AdminSidebar from "@/components/AdminDashboard/reuseable/AdminSidebar";
import DashboardHeader from "@/components/AdminDashboard/reuseable/DashboardHeader";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { selectToken } from "@/store/features/auth/auth.slice";
import {
  addNotification,
  removeNotification,
  clearNotifications,
  selectNotifications,
} from "@/store/features/notifications/notification.slice";
import { toast } from "sonner";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const token = useSelector(selectToken);
  const notifications = useSelector(selectNotifications);
  const dispatch = useDispatch();

  // ✅ Auto-clear notifications when visiting /admin/support page
  useEffect(() => {
    if (pathname === "/admin/support" && notifications.length > 0) {
      console.log("📋 Auto-clearing notifications on support page visit");
      
      // Mark all notifications as read via API
      notifications.forEach(async (notif: any) => {
        try {
          await fetch(`/api/report/mark-read/${notif._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          });
        } catch (err) {
          console.error("Failed to mark report as read on page visit:", err);
        }
      });
      
      // Clear all notifications from Redux store
      dispatch(clearNotifications());
      console.log("✅ All notifications cleared");
    }
  }, [pathname, notifications]);

  useEffect(() => {
    if (!token) return;

   const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:1800", {
      query: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ Admin layout socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Admin layout socket disconnected:", reason);
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connect_error:", error.message || error);
    });

// ✅ New report received → show toast first, then add to Redux store
    socket.on("new-report", (data: any) => {
      console.log("🔔 New report received:", data);
      console.log("📋 Data keys:", Object.keys(data));
      // Show toast notification with error handling
      try {
        // Use a default name if data.name is undefined
        const reportName = data?.name || data?.report?.text?.substring(0, 30) || "New Report";
        toast.info(`🔔 New report: ${reportName}`, {
          duration: 10000,
        });
        console.log("✅ Toast shown for report:", data._id);
      } catch (toastError) {
        console.error("❌ Toast error:", toastError);
      }
      // Then dispatch to Redux store
      dispatch(addNotification(data));
      console.log("➕ Dispatched addNotification:", data._id);
    });

    // ✅ NEW: report-read event → remove from Redux store (syncs across admin tabs)
    socket.on("report-read", (data: { reportId: string }) => {
      console.log("✅ Report marked as read:", data.reportId);
      dispatch(removeNotification(data.reportId));
      console.log("➖ Dispatched removeNotification:", data.reportId);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const hideSidebar =
    pathname.startsWith("/admin/student-profile/") ||
    pathname.startsWith("/admin/professional-profile/") ||
    pathname.startsWith("/admin/mentor-profile/");

  return (
    <div className="w-full min-h-screen bg-slate">
      <div className="w-full flex items-center justify-between bg-white">
        <DashboardHeader sidebarOpen={sidebarOpen} />
        <div className="lg:hidden pr-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger className="cursor-pointer" asChild>
              <button className="p-2 rounded-md border border-slate-200">
                <Menu className="h-6 w-6 cursor-pointer" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-70">
              <AdminSidebar
                sidebarOpen={true}
                onLinkClick={() => setSidebarOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex items-start px-4.5 pt-6 gap-6">
        {!hideSidebar && (
          <div className="hidden lg:block">
            <AdminSidebar sidebarOpen={true} />
          </div>
        )}

        <div className="flex-1">
          {hideSidebar ? (
            <CommonWrapper>
              <Outlet />
            </CommonWrapper>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;