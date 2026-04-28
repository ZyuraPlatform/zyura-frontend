import CommonWrapper from "@/common/CommonWrapper";
import AdminSidebar from "@/components/AdminDashboard/reuseable/AdminSidebar";
import DashboardHeader from "@/components/AdminDashboard/reuseable/DashboardHeader";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react"; // ✅ added useEffect
import { Outlet, useLocation } from "react-router-dom";
import { io } from "socket.io-client"; // ✅ new
import { useSelector, useDispatch } from "react-redux"; // ✅ new
import { selectToken } from "@/store/features/auth/auth.slice"; // ✅ new
import { addNotification } from "@/store/features/notifications/notification.slice"; // ✅ new

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const token = useSelector(selectToken); // ✅ new
  const dispatch = useDispatch(); // ✅ new

  // ✅ persistent socket — lives as long as admin is logged in
  useEffect(() => {
    if (!token) return;

    const socket = io("http://localhost:1800", {
      query: { token },
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("✅ Admin layout socket connected:", socket.id);
    });

    socket.on("new-report", (data: any) => {
      console.log("🔔 New report received:", data);
      dispatch(addNotification(data)); // ✅ store in Redux
    });

    return () => { socket.disconnect(); };
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