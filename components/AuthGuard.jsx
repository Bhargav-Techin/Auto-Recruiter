"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/provider"; // from your custom context

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { user, loading } = useUser(); // Assuming your context provides a loading state

  const [authState, setAuthState] = useState({
    isChecking: true,
    hasRedirected: false
  });

  useEffect(() => {
    // Promise-based approach to wait for user context
    const checkAuthentication = async () => {
      try {
        // Wait for user context to finish loading
        await new Promise((resolve) => {
          if (!loading) {
            resolve();
          } else {
            const checkLoading = () => {
              if (!loading) {
                resolve();
              } else {
                setTimeout(checkLoading, 50); // Check every 50ms
              }
            };
            checkLoading();
          }
        });

        // Now safely check authentication
        if (user === null && !authState.hasRedirected) {
          setAuthState(prev => ({ ...prev, hasRedirected: true }));
          router.push("/auth");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        // Fallback redirect on error
        if (!authState.hasRedirected) {
          setAuthState(prev => ({ ...prev, hasRedirected: true }));
          router.push("/auth");
        }
      } finally {
        setAuthState(prev => ({ ...prev, isChecking: false }));
      }
    };

    checkAuthentication();
  }, [user, loading, authState.hasRedirected, router]);

  // Show loading while checking authentication
  if (authState.isChecking || loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-500">
            {loading ? "Loading user data..." : "Verifying authentication..."}
          </p>
        </div>
      </div>
    );
  }

  // Show redirect message if user is null after loading
  if (user === null) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-sm text-gray-500">
        Redirecting to authentication...
      </div>
    );
  }

  // User is authenticated - render protected content
  return children;
}