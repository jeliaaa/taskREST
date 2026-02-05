// src/components/Login.tsx
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import banner from "../../assets/banner.png";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ username, password });
      navigate("/profile", { replace: true });
    } catch (err) {
      setError((err as Error).message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      {/* LEFT PANEL */}
      <div className="w-1/2 h-full bg-primary-color p-8 rounded-xl shadow-lg flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-300 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            required
            placeholder="Username"
            className="p-4 border rounded-md outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            required
            type="password"
            placeholder="Password"
            className="p-4 border rounded-md outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/80">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="underline cursor-pointer font-medium"
          >
            Create one
          </span>
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/2">
        <img
          src={banner}
          alt="Login Banner"
          className="w-full h-[90dvh] object-cover"
        />
      </div>
    </div>
  );
}
