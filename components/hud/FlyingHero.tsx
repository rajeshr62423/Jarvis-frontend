/**
 * A generic, original armored-flyer silhouette (not a depiction of any
 * specific copyrighted character) — simplified geometric shapes read fine at
 * the small/blurred sizes this renders at in the background field.
 */
export function FlyingHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 70"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="hero-armor" x1="0" x2="1" y1="0" y2="0.3">
          <stop offset="0%" stopColor="#0c1a22" />
          <stop offset="55%" stopColor="#1c313d" />
          <stop offset="100%" stopColor="#0a161d" />
        </linearGradient>
        <radialGradient id="hero-thruster" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e6fdff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="var(--jarvis-cyan)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--jarvis-cyan)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* trailing thruster glow (feet) */}
      <circle cx="9" cy="46" r="10" fill="url(#hero-thruster)" />
      <circle cx="11" cy="60" r="9" fill="url(#hero-thruster)" />

      {/* legs */}
      <path
        d="M55 42 Q30 50 8 46"
        stroke="url(#hero-armor)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M60 46 Q34 58 10 60"
        stroke="url(#hero-armor)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* arms, swept forward */}
      <path
        d="M70 28 Q42 18 18 22"
        stroke="url(#hero-armor)"
        strokeWidth="6.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M75 40 Q46 46 20 50"
        stroke="url(#hero-armor)"
        strokeWidth="6.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* torso */}
      <path
        d="M45 30 Q80 19 108 31 Q96 46 60 47 Q40 43 45 30 Z"
        fill="url(#hero-armor)"
      />
      <circle
        cx="80"
        cy="34"
        r="4.2"
        fill="var(--jarvis-cyan)"
        opacity="0.9"
      />

      {/* helmet */}
      <ellipse cx="113" cy="29" rx="13.5" ry="11.5" fill="url(#hero-armor)" />
      <path
        d="M101 27 Q113 21 123 27 Q112 33 101 30 Z"
        fill="var(--jarvis-cyan)"
        opacity="0.85"
      />

      {/* hand thruster glows */}
      <circle cx="17" cy="22" r="5" fill="url(#hero-thruster)" />
      <circle cx="19" cy="50" r="5" fill="url(#hero-thruster)" />
    </svg>
  );
}
