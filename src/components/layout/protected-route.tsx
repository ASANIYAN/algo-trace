import React, { useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth-contexts";
import { supabase } from "@/lib/supabase";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [checkingRecovery, setCheckingRecovery] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const checkRecovery = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!mounted) return;
      if (session) {
        // Check for recovery mode: user.recovery_at or amr method 'recovery'
        const isRecoverySession =
          (session.user as any)?.recovery_at ||
          (session.user as any)?.amr?.some((m: any) => m.method === "recovery");
        setIsRecovery(!!isRecoverySession);
      } else {
        setIsRecovery(false);
      }
      setCheckingRecovery(false);
    };
    checkRecovery();
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkRecovery();
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading || checkingRecovery) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-accent-blue border-t-transparent" />
          <p className="text-lg text-text-primary font-medium">
            Authenticating
          </p>
        </div>
      </div>
    );
  }

  // If in recovery mode and not on /reset-password, redirect
  if (isRecovery && location.pathname !== "/reset-password") {
    return <Navigate to="/reset-password" replace />;
  }

  // If not in recovery mode and on /reset-password, block access
  if (!isRecovery && location.pathname === "/reset-password") {
    return <Navigate to="/login" replace />;
  }

  if (!user && !isRecovery) {
    return <Navigate to="/signup" replace />;
  }

  // If children are provided, render them; otherwise, render Outlet for nested routes
  return <>{children ? children : <Outlet />}</>;
};
