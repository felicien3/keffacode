import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await register(form.username, form.email, form.password);
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0f13]/30 px-4 backdrop-blur-[1px]">
      <div className="max-h-[90vh] w-[min(92vw,560px)] overflow-y-auto rounded-[30px] bg-white p-6 shadow-[0_18px_38px_rgba(0,0,0,0.12)] md:p-8">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-[#1f2937] transition hover:bg-[#f3f4f6]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mx-auto max-w-[540px]">
          <h1 className="text-center text-[2.2rem] font-semibold tracking-tight text-[#111827]">
            Create account
          </h1>

          <p className="mt-4 text-center text-base text-[#1f2937]">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#0d6d4f] underline-offset-2 hover:underline"
            >
              Sign in
            </Link>
          </p>

          <button
            type="button"
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-[#dfe5e7] bg-[#f7f7f7] px-5 py-3.5 text-lg font-medium text-[#1f2937] shadow-sm transition hover:bg-[#f0f2f4]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-lg font-black text-[#1f2937]">
              G
            </span>
            Continue with Google
          </button>

          <div className="mt-8 flex items-center justify-center gap-5">
            {[
              { label: "f", bg: "bg-[#1877f2]" },
              { label: "in", bg: "bg-[#0a66c2]" },
              { label: "x", bg: "bg-[#111827]" },
              { label: "◌", bg: "bg-[#38bdf8]" },
            ].map((social) => (
              <button
                key={social.label}
                type="button"
                className={`flex h-12 w-12 items-center justify-center rounded-full ${social.bg} text-xl font-bold text-white shadow-sm`}
                aria-label={social.label}
              >
                {social.label}
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm text-[#7b838d]">
            <div className="h-px flex-1 bg-[#e5e7eb]" />
            <span>or</span>
            <div className="h-px flex-1 bg-[#e5e7eb]" />
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-base font-medium text-[#111827]">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full rounded-xl border border-[#dfe5e7] bg-[#f7f7f7] px-4 py-3 text-base text-[#111827] placeholder:text-[#8a929b] focus:border-[#0d6d4f] focus:outline-none"
                placeholder="Username"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-base font-medium text-[#111827]">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-[#dfe5e7] bg-[#f7f7f7] px-4 py-3 text-base text-[#111827] placeholder:text-[#8a929b] focus:border-[#0d6d4f] focus:outline-none"
                placeholder="Email"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-base font-medium text-[#111827]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#dfe5e7] bg-[#f7f7f7] px-4 py-3 pr-12 text-base text-[#111827] placeholder:text-[#8a929b] focus:border-[#0d6d4f] focus:outline-none"
                  placeholder="Password (8+ characters)"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-[#4b5563]"
                  aria-label="Toggle password visibility"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6"
                  >
                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3.2" />
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-4 w-full rounded-xl bg-[#0d6d4f] px-4 py-3 text-lg font-semibold text-white transition hover:bg-[#0b5b43] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {busy ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs leading-relaxed text-[#6b7280]">
            By creating this account, you agree to our{" "}
            <Link
              to="/privacy"
              className="font-medium text-[#0d6d4f] underline-offset-2 hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            &{" "}
            <Link
              to="/cookie-policy"
              className="font-medium text-[#0d6d4f] underline-offset-2 hover:underline"
            >
              Cookie Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
