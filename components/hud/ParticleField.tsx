"use client";

import { useSyncExternalStore } from "react";

const PARTICLE_COUNT = 18;

type Particle = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
};

function makeParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
    id,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 12 + Math.random() * 10,
    size: 1 + Math.random() * 1.5,
  }));
}

function subscribe() {
  return () => {};
}

let cachedParticles: Particle[] | null = null;

function getSnapshot(): Particle[] {
  if (!cachedParticles) cachedParticles = makeParticles();
  return cachedParticles;
}

// Empty on the server (and on the very first pre-hydration client render) so
// random positions never cause a server/client markup mismatch.
function getServerSnapshot(): Particle[] {
  return [];
}

/** Ambient floating-dust dots behind a hero section. */
export function ParticleField() {
  const particles = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle-dot"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
