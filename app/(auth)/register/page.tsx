"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/api/client";

export default function RegisterPage() {
  const router = useRouter();
  const { status, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
      await register(email, password, name);
      router.replace("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "REGISTRATION FAILED");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="NEW OPERATOR PROFILE" subtitle="PERSONAL AI OPERATING SYSTEM">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField
          label="NAME"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="hud-label text-jarvis-crit">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="hud-label mt-2 rounded border border-jarvis-border-strong py-2.5 text-jarvis-cyan transition-colors hover:bg-jarvis-glow/20 disabled:opacity-50"
        >
          {submitting ? "PROVISIONING..." : "CREATE ACCOUNT"}
        </button>
      </form>
      <p className="hud-label text-center opacity-60">
        ALREADY REGISTERED?{" "}
        <Link href="/login" className="text-jarvis-cyan hover:underline">
          SIGN IN
        </Link>
      </p>
    </AuthCard>
  );
}
