"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { appRoutes } from "@/lib/constants/routes.constants";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'teacher' | 'student')[];
  redirectPath?: string;
}

export function RoleGate({ 
  children, 
  allowedRoles, 
  redirectPath = appRoutes.login 
}: RoleGateProps) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!profile || !allowedRoles.includes(profile.role))) {
      router.push(redirectPath);
    }
  }, [profile, loading, allowedRoles, router, redirectPath]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    return null;
  }

  return <>{children}</>;
}
