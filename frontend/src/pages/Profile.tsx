import { useState } from "react";
import { useAuthStore } from "../stores/authStore";

export default function Profile() {
  const { user, accessToken, refreshToken, isAuthenticated, logout, hydrate } = useAuthStore();

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const copyToClipboard = async (text?: string | null) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Copied to clipboard");
    } catch {
      setError("Failed to copy");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-blue-600">
      <h1 className="text-2xl font-bold mb-4">Profile & Auth Debug</h1>

      <div className="mb-4">
        <strong>Status:</strong> {isAuthenticated ? "Authenticated" : "Anonymous"}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            hydrate();
            setMessage("Hydrated from localStorage");
            setError(null);
          }}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Hydrate
        </button>

        <button
          onClick={() => {
            logout();
            setMessage("Logged out");
            setError(null);
          }}
          className="px-3 py-1 bg-red-200 rounded"
        >
          Logout
        </button>
      </div>

      {message && <div className="mb-2 text-green-600">{message}</div>}
      {error && <div className="mb-2 text-red-600">{error}</div>}

      <section className="mb-6">
        <h2 className="font-semibold">User</h2>
        <pre className="bg-gray-100 p-3 rounded">{user?.username}</pre>
      </section>

      <section className="mb-6 w-full">
        <h2 className="font-semibold">Tokens</h2>
        <div className="mb-2">
          <div className="text-sm">Access Token:</div>
          <div className="bg-gray-50 p-2 w-full rounded break-words">{accessToken ?? "-"}</div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => copyToClipboard(accessToken)} className="px-2 py-1 bg-blue-200 rounded">Copy Access</button>
          </div>
        </div>

        <div>
          <div className="text-sm">Refresh Token:</div>
          <div className="bg-gray-50 p-2 break-words rounded">{refreshToken ?? "-"}</div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => copyToClipboard(refreshToken)} className="px-2 py-1 bg-blue-200 rounded">Copy Refresh</button>
          </div>
        </div>
      </section>

      {/* login/register forms removed — read-only display only */}
    </div>
  );
}
