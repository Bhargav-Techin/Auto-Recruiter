"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/provider";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { user, loading } = useUser();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    console.log("[AuthGuard] user:", user, "loading:", loading);
    
    // Only proceed when loading is complete
    if (!loading) {
      if (!user && !hasRedirected) {
        console.log("[AuthGuard] No user found, redirecting to auth");
        setHasRedirected(true);
        router.push("/auth");
      }
    }
  }, [user, loading, hasRedirected, router]);

  // Show loading while the provider is still loading user data
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-lg text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Show redirect message if no user after loading is complete
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-pulse text-gray-500">
            <p className="text-lg">Redirecting to authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and loaded - render protected content
  console.log("[AuthGuard] Rendering protected content for user:", user.email);
  return children;
}