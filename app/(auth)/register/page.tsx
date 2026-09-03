"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/api/client";

export default function RegisterPage() {
  const router = useRouter();
  const { status, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  const passwordMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("PASSWORDS DO NOT MATCH");
      return;
    }
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
    <AuthCard
      eyebrow="NEW OPERATOR PROFILE"
      heading="Create Access"
      tagline="Establish a new neural profile to get started."
      subtitle="PERSONAL AI OPERATING SYSTEM"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField
          label="NAME"
          icon={User}
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AuthField
          label="CONFIRM PASSWORD"
          icon={Lock}
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={passwordMismatch ? "PASSWORDS DO NOT MATCH" : undefined}
        />

        {error && <AuthAlert>{error}</AuthAlert>}

        <button
          type="submit"
          disabled={submitting}
          className="auth-submit-button hud-label mt-2 flex items-center justify-center gap-2 rounded border border-jarvis-border-strong py-2.5 text-jarvis-cyan transition-all hover:bg-jarvis-glow/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {submitting ? "PROVISIONING..." : "INITIALIZE ACCESS"}
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
