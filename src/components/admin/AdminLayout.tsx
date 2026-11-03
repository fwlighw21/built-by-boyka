"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home, AlertCircle } from "lucide-react";
import AdminSidebar, { ADMIN_NAV_GROUPS } from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const INACTIVITY_TIMEOUT_MS = 30 * 1000; // 30 seconds

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(30);
  const router = useRouter();
  const pathname = usePathname();

  const lastActivityRef = useRef<number>(Date.now());
  const lastPingRef = useRef<number>(Date.now());
  const isLoggingOutRef = useRef<boolean>(false);

  // Trigger logout and redirect to login page with expired reason
  const handleInactivityLogout = useCallback(async () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    }
    router.replace("/admin/login?reason=expired");
  }, [router]);

  // Initial authentication check
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) {
          router.replace("/admin/login?reason=expired");
          return;
        }
        const data = await res.json();
        if (isMounted) {
          setAdminUser(data.user);
          setLoading(false);
          lastActivityRef.current = Date.now();
        }
      } catch {
        clearTimeout(timeoutId);
        if (isMounted) {
          router.replace("/admin/login?reason=expired");
        }
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [router]);

  // Activity handler for user interactions
  const recordActivity = useCallback(() => {
    if (isLoggingOutRef.current) return;
    const now = Date.now();
    lastActivityRef.current = now;

    // Throttle heartbeat ping to server (at most once every 3.5 seconds)
    if (now - lastPingRef.current > 3500) {
      lastPingRef.current = now;
      fetch("/api/auth/ping", { method: "POST" })
        .then((res) => {
          if (!res.ok) {
            handleInactivityLogout();
          } else {
            return res.json();
          }
        })
        .then((data) => {
          if (data && typeof data.remainingSeconds === "number") {
            setRemainingSeconds(data.remainingSeconds);
          }
        })
        .catch(() => {
          // If network error, timer interval will continue tracking
        });
    }
  }, [handleInactivityLogout]);

  // Inactivity ticker and tab visibility listener
  useEffect(() => {
    if (loading) return;

    // Attach interaction listeners
    const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];
    activityEvents.forEach((evt) => window.addEventListener(evt, recordActivity, { passive: true }));

    // 1-second interval to check inactivity countdown
    const timer = setInterval(() => {
      if (isLoggingOutRef.current) return;
      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = Math.max(0, Math.ceil((INACTIVITY_TIMEOUT_MS - elapsed) / 1000));
      setRemainingSeconds(remaining);

      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        handleInactivityLogout();
      }
    }, 1000);

    // Tab visibility listener: when tab becomes active again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const elapsed = Date.now() - lastActivityRef.current;
        if (elapsed >= INACTIVITY_TIMEOUT_MS) {
          handleInactivityLogout();
        } else {
          // Verify with server immediately
          fetch("/api/auth/ping", { method: "POST" })
            .then((res) => {
              if (!res.ok) {
                handleInactivityLogout();
              }
            })
            .catch(() => {
              handleInactivityLogout();
            });
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      activityEvents.forEach((evt) => window.removeEventListener(evt, recordActivity));
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(timer);
    };
  }, [loading, recordActivity, handleInactivityLogout]);

  // Find parent category for breadcrumbs
  const currentGroup = ADMIN_NAV_GROUPS.find((group) =>
    group.items.some((item) =>
      item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">
          Verifying Admin Session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminTopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={title}
          adminName={adminUser?.name || adminUser?.username || "Coach Boyka"}
          remainingSeconds={remainingSeconds}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Breadcrumb Navigation */}
          {pathname !== "/admin" && (
            <nav className="flex items-center gap-2 text-xs text-gray-400 animate-in fade-in">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Home className="w-3.5 h-3.5 text-primary" />
                <span>Dashboard</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />

              {currentGroup && currentGroup.id !== "dashboard" && (
                <>
                  <span className="text-gray-400 font-medium">{currentGroup.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                </>
              )}

              <span className="text-accent font-bold">{title}</span>
            </nav>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
