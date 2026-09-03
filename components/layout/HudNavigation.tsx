"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  // Boxes,
  // CalendarDays,
  Home,
  // ListChecks,
  LogOut,
  // Plug,
  SlidersHorizontal,
  Terminal,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAssistantIdentity } from "@/hooks/useAssistantIdentity";
import { useGetProfileQuery } from "@/store/api";
import { resolveAvatarUrl } from "@/lib/avatar";
import { ASSISTANT_IDENTITIES } from "@/lib/assistantIdentities";
import { SignOutButton } from "@/components/auth/SignOutButton";

const ITEMS = [
  { href: "/", label: "HOME", icon: Home },
  { href: "/command-center", label: "COMMAND CENTER", icon: Terminal },
  // { href: "/tasks", label: "TASKS", icon: ListChecks },
  // { href: "/calendar", label: "CALENDAR", icon: CalendarDays },
  // { href: "/automations", label: "AUTOMATION", icon: Boxes },
  // { href: "/integrations", label: "SYSTEM", icon: Plug },
  { href: "/settings", label: "SETTINGS", icon: SlidersHorizontal },
] as const;

// Mobile bottom bar mirrors the same set now that Tasks/Automation/System
// are hidden — reinstate the curated subset here if those come back while
// the desktop list grows past what a phone width can show.
const MOBILE_ITEMS = ITEMS;

function AvatarBadge({
  src,
  size = "h-9 w-9",
}: {
  src: string | null;
  size?: string;
}) {
  return (
    <div
      className={`relative ${size} shrink-0 overflow-hidden rounded-full border border-jarvis-border-strong bg-jarvis-bg-2`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-jarvis-muted">
          <User className="h-4 w-4" />
        </div>
      )}
      <span
        className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-jarvis-panel bg-jarvis-ok"
        style={{ boxShadow: "0 0 6px var(--jarvis-ok)" }}
      />
    </div>
  );
}

function MiniArcReactor() {
  return (
    <span className="brand-reactor" aria-hidden="true">
      <span className="brand-reactor-outer" />
      <span className="brand-reactor-inner" />
      <span className="brand-reactor-core" />
      <span className="brand-reactor-node brand-reactor-node-one" />
      <span className="brand-reactor-node brand-reactor-node-two" />
      <span className="brand-reactor-node brand-reactor-node-three" />
    </span>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 ${
        active
          ? "bg-jarvis-elevated/70 text-jarvis-fg"
          : "text-jarvis-muted hover:bg-white/[0.03] hover:text-jarvis-fg"
      }`}
    >
      {active && (
        <span
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-jarvis-cyan"
          style={{ boxShadow: "0 0 8px var(--jarvis-cyan)" }}
        />
      )}
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
          active
            ? "bg-jarvis-cyan/15 text-jarvis-cyan"
            : "bg-white/[0.03] text-jarvis-muted group-hover:text-jarvis-fg"
        }`}
        style={active ? { boxShadow: "0 0 14px -2px var(--jarvis-glow)" } : undefined}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="hud-label">{label}</span>
    </Link>
  );
}

function ProfileCard({
  avatarSrc,
  name,
}: {
  avatarSrc: string | null;
  name: string;
}) {
  return (
    <div className="sidebar-profile-card flex items-center gap-3 rounded-lg px-3 py-3">
      <AvatarBadge src={avatarSrc} />
      <Link href="/settings" className="min-w-0 flex-1">
        <p className="truncate text-xs text-jarvis-fg">{name}</p>
        <p className="hud-label text-[0.6rem] text-jarvis-ok">ONLINE</p>
      </Link>
      <SignOutButton
        aria-label="Sign out"
        className="text-jarvis-muted transition-colors hover:text-jarvis-crit"
      >
        <LogOut className="h-4 w-4" />
      </SignOutButton>
    </div>
  );
}

export function HudNavigation() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { data: profile } = useGetProfileQuery();
  const avatarSrc = resolveAvatarUrl(profile?.avatarUrl);
  const identity = useAssistantIdentity();
  const identityTagline =
    ASSISTANT_IDENTITIES.find((i) => i.value === identity)?.description ??
    "Personal AI operating system";

  return (
    <>
      {/* Desktop — full sidebar with labels */}
      <nav className="sidebar-panel hud-panel hidden lg:flex lg:w-60 lg:shrink-0 lg:flex-col lg:py-5">
        <div className="flex items-center gap-3 px-5 pb-6">
          <MiniArcReactor />
          <div className="flex flex-col">
            <span className="hud-display text-sm font-semibold tracking-[0.3em] text-jarvis-fg">
              {identity}
            </span>
            <span className="hud-label text-[0.55rem] tracking-[0.15em] text-jarvis-cyan/70">
              {identityTagline.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1 px-3">
          {ITEMS.map(({ href, label, icon }) => (
            <NavItem key={href} href={href} label={label} icon={icon} active={pathname === href} />
          ))}
        </div>

        <div className="mt-4 border-t border-jarvis-border px-3 pt-4">
          <ProfileCard avatarSrc={avatarSrc} name={user?.name ?? "Operator"} />
        </div>
      </nav>

      {/* Tablet — collapsible icon-only rail */}
      <nav className="sidebar-panel hud-panel hidden md:flex md:w-20 md:shrink-0 md:flex-col md:items-center md:gap-2 md:py-5 lg:hidden">
        <MiniArcReactor />
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                active
                  ? "border-jarvis-border-strong bg-jarvis-elevated text-jarvis-cyan"
                  : "border-transparent text-jarvis-muted hover:border-jarvis-border hover:text-jarvis-fg"
              }`}
              style={
                active
                  ? { boxShadow: "0 0 16px -4px var(--jarvis-glow)" }
                  : undefined
              }
            >
              <Icon className="h-4 w-4" />
            </Link>
          );
        })}
        <div className="mt-auto flex flex-col items-center gap-3 pt-4">
          <AvatarBadge src={avatarSrc} size="h-8 w-8" />
          <SignOutButton
            aria-label="Sign out"
            className="text-jarvis-muted transition-colors hover:text-jarvis-crit"
          >
            <LogOut className="h-4 w-4" />
          </SignOutButton>
        </div>
      </nav>

      {/* Mobile — bottom bar, curated subset */}
      <nav className="mobile-bottom-nav hud-panel fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around md:hidden">
        {MOBILE_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-w-[3.5rem] flex-1 flex-col items-center justify-center gap-1 px-1 py-2.5 transition-colors ${
                active ? "text-jarvis-cyan" : "text-jarvis-muted"
              }`}
            >
              {active && (
                <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-jarvis-cyan" />
              )}
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  active ? "bg-jarvis-glow/20" : ""
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="hud-label text-[0.6rem] leading-tight">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
