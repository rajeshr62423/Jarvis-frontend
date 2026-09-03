"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Lock, Mail } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { AuthCheckbox } from "@/components/auth/AuthCheckbox";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/api/client";

export default function LoginPage() {
  const router = useRouter();
  const { status, login } = useAuth();
  const [email, setEmail] = useState("tony@starkindustries.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [forgotNotice, setForgotNotice] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "AUTHENTICATION FAILED");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      eyebrow="IDENTITY VERIFICATION"
      heading="Welcome Back"
      tagline="Initialize your neural link to continue."
      subtitle="PERSONAL AI OPERATING SYSTEM"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField
          label="EMAIL"
          icon={Mail}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          label="PASSWORD"
          icon={Lock}
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center justify-between gap-3">
          <AuthCheckbox
            checked={rememberMe}
            onChange={setRememberMe}
            label="REMEMBER THIS TERMINAL"
          />
          <button
            type="button"
            onClick={() => setForgotNotice((v) => !v)}
            className="hud-label shrink-0 text-jarvis-cyan transition-colors hover:opacity-80"
          >
            FORGOT CREDENTIALS?
          </button>
        </div>
        {forgotNotice && (
          <p className="hud-label text-jarvis-muted">
            Credential recovery isn&rsquo;t available yet — contact your administrator.
          </p>
        )}

        {error && <AuthAlert>{error}</AuthAlert>}

        <button
          type="submit"
          disabled={submitting}
          className="auth-submit-button hud-label mt-2 flex items-center justify-center gap-2 rounded border border-jarvis-border-strong py-2.5 text-jarvis-cyan transition-all hover:bg-jarvis-glow/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {submitting ? "AUTHENTICATING..." : "INITIALIZE LINK"}
        </button>
      </form>
      <p className="hud-label text-center opacity-60">
        NO ACCESS CREDENTIALS?{" "}
        <Link href="/register" className="text-jarvis-cyan hover:underline">
          REQUEST NEW CLEARANCE
        </Link>
      </p>
    </AuthCard>
  );
}
