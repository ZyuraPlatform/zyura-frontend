import { useEffect, useRef } from "react";
import { useAppSelector } from "@/store/hook";
import { selectToken, selectUser } from "@/store/features/auth/auth.slice";
import { io, Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";

const SocketTracker = () => {
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const { pathname } = useLocation();
  const socketRef = useRef<Socket | null>(null);

  const getFeatureKey = (path: string): string | null => {
    if (
      path.includes("/dashboard/mcq-bank") ||
      path.includes("/dashboard/practice-mcq") ||
      path.includes("/dashboard/test") ||
      path.includes("/dashboard/quiz-generator") ||
      path.includes("/dashboard/quiz-page") ||
      path.includes("/dashboard/quiz-collection") ||
      path.includes("/dashboard/all-generated-quiz") ||
      path.includes("/dashboard/quiz/") ||
      path.includes("/dashboard/quiz-answer-overview")
    ) {
      return "mcq";
    }
    if (
      path.includes("/dashboard/clinical-case-generator") ||
      path.includes("/dashboard/clinical-case")
    ) {
      return "clinical_case";
    }
    if (
      path.includes("/dashboard/osce") ||
      path.includes("/dashboard/practice-with-checklist") ||
      path.includes("/dashboard/osce-tutorial") ||
      path.includes("/dashboard/check-list-result")
    ) {
      return "osce";
    }
    return null;
  };

  const featureKey = getFeatureKey(pathname);

  useEffect(() => {
    const role = user?.account?.role;
    const isEligible =
      role === "STUDENT" || role === "PROFESSIONAL" || role === "ADMIN";

    const connectSocket = () => {
      if (socketRef.current) {
        const socketQuery = socketRef.current.io.opts.query as Record<string, string>;
        if (socketQuery?.key === (featureKey || undefined)) {
          if (socketRef.current.connected) return;
          socketRef.current.connect();
          return;
        }
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      console.log(
        `Initializing Socket.IO Tracker for ${role} with key: ${featureKey || "none"}...`
      );

      const queryParams: Record<string, string> = {
        token: token || "",
      };

      if (featureKey) {
        queryParams.key = featureKey;
      }

      const socket = io("https://api.zyura-e.com", {
        query: queryParams,
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Socket.IO connection established for tracking.");
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket.IO disconnected:", reason);
        if (reason === "io server disconnect") {
          socket.connect();
        }
      });

      socket.on("connect_error", (error) => {
        console.error("Socket.IO connection error:", error);
      });

      // ✅ REMOVED: "new-report" handler — AdminLayout owns this now to avoid
      //    duplicate toasts and to properly dispatch to Redux store.
    };

    const disconnectSocket = () => {
      if (socketRef.current) {
        console.log("Visibility changed/Unmount: Disconnecting Socket.IO...");
        socketRef.current.disconnect();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        disconnectSocket();
      } else {
        if (isEligible && token) {
          connectSocket();
        }
      }
    };

    if (token && isEligible) {
      if (!document.hidden) {
        connectSocket();
      }
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (socketRef.current) {
          console.log("Cleanup: Disconnecting Socket.IO...");
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }
  }, [token, user?.account?.role, featureKey]);

  return null;
};

export default SocketTracker;