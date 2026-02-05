// src/components/Register.tsx
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import banner from "../../assets/banner.png";

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }
  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    if (password !== repassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await register({
        username,
        email,
        phone,
        password,
        repassword,
      });

      navigate("/profile", { replace: true });
    } catch (err) {
      setError((err as Error).message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-1/2 h-full bg-primary-color p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Create Account
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            required
            placeholder="Username"
            className="input p-4 border rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            required
            type="email"
            placeholder="Email"
            className="input p-4 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            required
            type="tel"
            placeholder="Phone number"
            className="input p-4 border rounded-md"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="flex gap-x-2">
            <input
              required
              type="password"
              placeholder="Password"
              className="input p-4 border rounded-md w-1/2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              required
              type="password"
              placeholder="Confirm password"
              className="input p-4 border rounded-md w-1/2"
              value={repassword}
              onChange={(e) => setRepassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
      <div className="w-1/2">
        <img src={banner} alt="Register Banner" className="w-full h-[90dvh] object-cover" /></div>
    </div>
  );
}
