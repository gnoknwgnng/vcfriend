"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { adminLogin } from "./actions";

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("passcode", passcode);

    try {
      const res = await adminLogin(formData);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setPasscode("");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-mist font-sans">
      <div className="max-w-md w-full space-y-6 surface p-8 animate-fade-in text-center">
        <div className="space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-teal-light flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-teal-deep" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink">
              Investor Access Portal
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Please enter the passcode to access the reviews & highlights board.
            </p>
          </div>

          {!configured && (
            <p className="notice notice-warn text-left" role="alert">
              Admin access is not configured yet. Set the <code>ADMIN_PASSCODE</code> environment variable on the server and redeploy.
            </p>
          )}

          <form onSubmit={handleUnlock} className="mt-8 space-y-4">
            <input
              type="password"
              name="passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter password..."
              className="field text-center text-lg font-semibold"
              autoComplete="current-password"
              aria-label="Admin passcode"
              required
            />
            {error && (
              <p className="text-coral-deep text-sm font-medium" role="alert">{error}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-coral w-full"
            >
              {isLoading ? "Checking..." : "Unlock Portal"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
