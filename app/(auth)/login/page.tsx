"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/api/client";

export default function LoginPage() {
  const router = useRouter();
  const { status, login } = useAuth();
  const [email, setEmail] = useState("tony@starkindustries.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    <AuthCard title="IDENTITY VERIFICATION" subtitle="PERSONAL AI OPERATING SYSTEM">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField
          label="EMAIL"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          label="PASSWORD"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="hud-label text-jarvis-crit">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="hud-label mt-2 rounded border border-jarvis-border-strong py-2.5 text-jarvis-cyan transition-colors hover:bg-jarvis-glow/20 disabled:opacity-50"
        >
          {submitting ? "AUTHENTICATING..." : "AUTHENTICATE"}
        </button>
      </form>
      <p className="hud-label text-center opacity-60">
        NO ACCESS CREDENTIALS?{" "}
        <Link href="/register" className="text-jarvis-cyan hover:underline">
          REGISTER
        </Link>
      </p>
    </AuthCard>
  );
}
