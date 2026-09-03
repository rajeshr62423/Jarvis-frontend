"use client";

import { useSyncExternalStore } from "react";
import { FlyingHero } from "@/components/hud/FlyingHero";

type Tier = "far" | "mid" | "near";
type Direction = "ltr" | "rtl" | "diagonal-in" | "diagonal-out";

type Flyer = {
  id: number;
  tier: Tier;
  quickPass: boolean;
  visibleFrom: "block" | "hidden sm:block" | "hidden lg:block";
  style: React.CSSProperties;
};

const TIER_SETTINGS: Record<
  Tier,
  { widthVw: number; opacity: number; blurPx: number; durationRange: [number, number] }
> = {
  far: { widthVw: 6, opacity: 0.22, blurPx: 2.5, durationRange: [26, 34] },
  mid: { widthVw: 9, opacity: 0.4, blurPx: 1, durationRange: [18, 24] },
  near: { widthVw: 13, opacity: 0.6, blurPx: 0, durationRange: [12, 17] },
};

// tier + direction + a visibility-breakpoint class so fewer render on mobile
// (the CSS media query hides the rest — no JS viewport detection needed).
// `quickPass` marks the rare fast far-background streak called for in the
// brief — same tier/opacity/blur as a normal "far" flyer, just much faster
// and with a long delay so it doesn't repeat too often.
const PLAN: {
  tier: Tier;
  direction: Direction;
  visibleFrom: Flyer["visibleFrom"];
  quickPass?: boolean;
}[] = [
  { tier: "near", direction: "ltr", visibleFrom: "block" },
  { tier: "mid", direction: "rtl", visibleFrom: "block" },
  { tier: "far", direction: "ltr", visibleFrom: "block" },
  { tier: "mid", direction: "diagonal-in", visibleFrom: "hidden sm:block" },
  { tier: "far", direction: "rtl", visibleFrom: "hidden sm:block" },
  { tier: "near", direction: "diagonal-out", visibleFrom: "hidden lg:block" },
  { tier: "far", direction: "diagonal-out", visibleFrom: "hidden lg:block" },
  { tier: "far", direction: "ltr", visibleFrom: "hidden lg:block", quickPass: true },
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pathFor(direction: Direction) {
  const baseY = rand(6, 62);
  switch (direction) {
    case "ltr":
      return { x0: -25, y0: baseY, x1: 125, y1: baseY, flip: 1, rot: rand(-6, 6) };
    case "rtl":
      return { x0: 125, y0: baseY, x1: -25, y1: baseY, flip: -1, rot: rand(-6, 6) };
    case "diagonal-in":
      return {
        x0: -25,
        y0: rand(2, 22),
        x1: 125,
        y1: rand(42, 78),
        flip: 1,
        rot: rand(10, 18),
      };
    case "diagonal-out":
      return {
        x0: 125,
        y0: rand(2, 22),
        x1: -25,
        y1: rand(42, 78),
        flip: -1,
        rot: rand(-18, -10),
      };
  }
}

function makeFlyers(): Flyer[] {
  return PLAN.map((entry, id) => {
    const t = TIER_SETTINGS[entry.tier];
    const path = pathFor(entry.direction);
    const midX = (path.x0 + path.x1) / 2;
    const midY = (path.y0 + path.y1) / 2 + rand(-6, 6);
    // Quick-pass flyers use a long total cycle where the visible streak is
    // only a small slice of it (see .flying-hero-quick-pass keyframes),
    // so it reads as a rare event with a genuine idle gap in between —
    // not just a fast loop.
    const duration = entry.quickPass ? rand(40, 65) : rand(t.durationRange[0], t.durationRange[1]);
    const delay = entry.quickPass ? rand(0, duration) : rand(-duration, duration * 0.4);

    return {
      id,
      tier: entry.tier,
      quickPass: Boolean(entry.quickPass),
      visibleFrom: entry.visibleFrom,
      style: {
        "--fx0": `${path.x0}vw`,
        "--fy0": `${path.y0}vh`,
        "--fxm": `${midX}vw`,
        "--fym": `${midY}vh`,
        "--fx1": `${path.x1}vw`,
        "--fy1": `${path.y1}vh`,
        "--frot": `${path.rot}deg`,
        "--fflip": path.flip,
        "--fop": t.opacity,
        width: `${t.widthVw}vw`,
        filter: t.blurPx ? `blur(${t.blurPx}px)` : undefined,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      } as React.CSSProperties,
    };
  });
}

function subscribe() {
  return () => {};
}

let cachedFlyers: Flyer[] | null = null;

function getSnapshot(): Flyer[] {
  if (!cachedFlyers) cachedFlyers = makeFlyers();
  return cachedFlyers;
}

// Empty on the server / first client render so random paths never cause a
// hydration mismatch. Must return the same array reference every call, or
// useSyncExternalStore treats each render as a fresh update and loops.
const EMPTY_FLYERS: Flyer[] = [];

function getServerSnapshot(): Flyer[] {
  return EMPTY_FLYERS;
}

export function FlyingHeroesField() {
  const flyers = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className="flying-heroes-field" aria-hidden="true">
      {flyers.map((flyer) => (
        <div
          key={flyer.id}
          className={`flying-hero flying-hero-${flyer.tier} ${
            flyer.quickPass ? "flying-hero-quick-pass" : ""
          } ${flyer.visibleFrom}`}
          style={flyer.style}
        >
          <FlyingHero className="h-auto w-full" />
        </div>
      ))}
    </div>
  );
}
