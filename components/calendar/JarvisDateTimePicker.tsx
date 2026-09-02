"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";

type PickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const WEEKDAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

function parseValue(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return new Date();
  return new Date(+match[1], +match[2] - 1, +match[3], +match[4], +match[5]);
}

function formatValue(date: Date) {
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function calendarDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  return Array.from(
    { length: 42 },
    (_, index) =>
      new Date(
        month.getFullYear(),
        month.getMonth(),
        index - first.getDay() + 1,
      ),
  );
}

export function JarvisDateTimePicker({ label, value, onChange }: PickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseValue(value);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(selected.getFullYear(), selected.getMonth(), 1),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const days = useMemo(() => calendarDays(visibleMonth), [visibleMonth]);
  const today = new Date();
  const hour12 = selected.getHours() % 12 || 12;
  const meridiem = selected.getHours() >= 12 ? "PM" : "AM";

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !rootRef.current?.contains(target) &&
        !popupRef.current?.contains(target)
      )
        setOpen(false);
    };
    const positionPopup = () => {
      const trigger = rootRef.current?.querySelector(".jarvis-picker-trigger");
      if (!(trigger instanceof HTMLElement)) return;
      const rect = trigger.getBoundingClientRect();
      const width = Math.min(680, window.innerWidth - 32);
      const estimatedHeight = window.innerWidth <= 640 ? 560 : 390;
      const top =
        rect.bottom + 8 + estimatedHeight <= window.innerHeight
          ? rect.bottom + 8
          : Math.max(16, rect.top - estimatedHeight - 8);
      const left = Math.min(
        Math.max(16, rect.left),
        window.innerWidth - width - 16,
      );
      setPopupPosition({ top, left });
    };
    positionPopup();
    window.addEventListener("resize", positionPopup);
    window.addEventListener("scroll", positionPopup, true);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("resize", positionPopup);
      window.removeEventListener("scroll", positionPopup, true);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  const updateDate = (date: Date) => onChange(formatValue(date));
  const updateTime = (
    nextHour: number,
    nextMinute: number,
    nextMeridiem = meridiem,
  ) => {
    const hour24 = nextMeridiem === "PM" ? (nextHour % 12) + 12 : nextHour % 12;
    const next = new Date(selected);
    next.setHours(hour24, nextMinute, 0, 0);
    onChange(formatValue(next));
  };
  const shiftMonth = (amount: number) =>
    setVisibleMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() + amount, 1),
    );
  const displayValue = value
    ? `${selected.toLocaleDateString([], { month: "short", day: "2-digit", year: "numeric" }).toUpperCase()} ${selected.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : "SELECT DATE / TIME";

  return (
    <div ref={rootRef} className="jarvis-picker-field">
      <span className="hud-label">{label}</span>
      <button
        type="button"
        className="jarvis-picker-trigger hud-input hud-mono"
        onClick={() => {
          setVisibleMonth(
            new Date(selected.getFullYear(), selected.getMonth(), 1),
          );
          setOpen((current) => !current);
        }}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <CalendarDays className="h-4 w-4 shrink-0 text-jarvis-cyan" />
        <span className={value ? "text-jarvis-fg" : "text-jarvis-muted-2"}>
          {displayValue}
        </span>
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popupRef}
            className="jarvis-picker-popup"
            style={{ top: popupPosition.top, left: popupPosition.left }}
            role="dialog"
            aria-label={`${label} date and time picker`}
          >
            <div className="jarvis-picker-calendar">
              <div className="jarvis-picker-month">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="hud-label text-jarvis-cyan">
                  {visibleMonth
                    .toLocaleDateString([], { month: "long", year: "numeric" })
                    .toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="jarvis-picker-weekdays">
                {WEEKDAYS.map((day) => (
                  <span key={day} className="hud-label">
                    {day}
                  </span>
                ))}
              </div>
              <div className="jarvis-picker-days">
                {days.map((day) => {
                  const isSelected = dayKey(day) === dayKey(selected);
                  const isToday = dayKey(day) === dayKey(today);
                  const isOutside = day.getMonth() !== visibleMonth.getMonth();
                  return (
                    <button
                      type="button"
                      key={day.toISOString()}
                      onClick={() => updateDate(day)}
                      className={`jarvis-picker-day ${isSelected ? "is-selected" : ""} ${isToday ? "is-today" : ""} ${isOutside ? "is-outside" : ""}`}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="jarvis-picker-time">
              <span className="hud-label text-jarvis-cyan">
                <Clock3 className="mr-1 inline h-3.5 w-3.5" /> TIME
              </span>
              <div className="jarvis-time-control">
                <button
                  type="button"
                  onClick={() =>
                    updateTime(hour12 - 1 || 12, selected.getMinutes())
                  }
                  aria-label="Previous hour"
                >
                  −
                </button>
                <strong>{String(hour12).padStart(2, "0")}</strong>
                <button
                  type="button"
                  onClick={() => updateTime(hour12 + 1, selected.getMinutes())}
                  aria-label="Next hour"
                >
                  +
                </button>
              </div>
              <div className="jarvis-time-control">
                <button
                  type="button"
                  onClick={() =>
                    updateTime(hour12, (selected.getMinutes() + 55) % 60)
                  }
                  aria-label="Previous five minutes"
                >
                  −
                </button>
                <strong>
                  {String(selected.getMinutes()).padStart(2, "0")}
                </strong>
                <button
                  type="button"
                  onClick={() =>
                    updateTime(hour12, (selected.getMinutes() + 5) % 60)
                  }
                  aria-label="Next five minutes"
                >
                  +
                </button>
              </div>
              <div className="jarvis-meridiem">
                <button
                  type="button"
                  className={meridiem === "AM" ? "is-active" : ""}
                  onClick={() =>
                    updateTime(hour12, selected.getMinutes(), "AM")
                  }
                >
                  AM
                </button>
                <button
                  type="button"
                  className={meridiem === "PM" ? "is-active" : ""}
                  onClick={() =>
                    updateTime(hour12, selected.getMinutes(), "PM")
                  }
                >
                  PM
                </button>
              </div>
            </div>
            <div className="jarvis-picker-footer">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="hud-label"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="hud-label text-jarvis-cyan"
              >
                CONFIRM
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
