"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Trash2,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetEventsQuery,
} from "@/store/api";
import { HudPanel } from "@/components/hud/HudPanel";

function monthRange(anchor: Date) {
  const from = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const to = new Date(
    anchor.getFullYear(),
    anchor.getMonth() + 1,
    0,
    23,
    59,
    59,
  );
  return { from: from.toISOString(), to: to.toISOString() };
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function monthDays(anchor: Date) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const cells: Date[] = [];
  for (let index = 0; index < 42; index += 1) {
    cells.push(
      new Date(
        anchor.getFullYear(),
        anchor.getMonth(),
        index - first.getDay() + 1,
      ),
    );
  }
  return cells;
}

export default function CalendarPage() {
  const [anchor, setAnchor] = useState(() => new Date());
  const [title, setTitle] = useState("");
  const [startAt, setStartAt] = useState<Date | null>(null);
  const [endAt, setEndAt] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);

  const range = useMemo(() => monthRange(anchor), [anchor]);
  const { data: events = [], isLoading } = useGetEventsQuery(range);
  const [createEvent, { isLoading: creating }] = useCreateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const monthLabel = anchor
    .toLocaleDateString([], { month: "long", year: "numeric" })
    .toUpperCase();

  const sorted = [...events].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );
  const cells = monthDays(anchor);
  const eventsByDay = events.reduce<Record<string, typeof events>>(
    (groups, event) => {
      const key = dateKey(new Date(event.startAt));
      groups[key] = [...(groups[key] ?? []), event];
      return groups;
    },
    {},
  );
  const selectedEvents = eventsByDay[dateKey(selectedDate)] ?? [];
  const today = new Date();
  const selectedLabel = selectedDate
    .toLocaleDateString([], { month: "short", day: "numeric" })
    .toUpperCase();

  useEffect(() => {
    if (!isCreateOpen) return;
    titleInputRef.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCreateOpen(false);
        setTitle("");
        setStartAt(null);
        setEndAt(null);
        setCreateError("");
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isCreateOpen]);

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setTitle("");
    setStartAt(null);
    setEndAt(null);
    setCreateError("");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startAt || !endAt) {
      setCreateError("COMPLETE THE EVENT TITLE AND DATE / TIME FIELDS");
      return;
    }
    if (endAt.getTime() <= startAt.getTime()) {
      setCreateError("END DATE / TIME MUST FOLLOW THE START");
      return;
    }
    setCreateError("");
    try {
      await createEvent({
        title: title.trim(),
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
      }).unwrap();
    } catch {
      setCreateError("EVENT COULD NOT BE ADDED. CHECK THE API CONNECTION.");
      return;
    }
    setTitle("");
    setStartAt(null);
    setEndAt(null);
    setIsCreateOpen(false);
  };

  return (
    <div className="calendar-command-center flex h-full flex-col gap-4">
      <header className="calendar-header flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="hud-label mb-2 text-jarvis-cyan">
            SCHEDULE MANAGEMENT SYSTEM
          </p>
          <h1 className="hud-display text-xl tracking-[0.16em] text-jarvis-fg">
            CALENDAR
          </h1>
        </div>
        <div className="calendar-header-actions flex flex-wrap items-center gap-2">
          <div className="calendar-month-nav hud-panel flex items-center gap-2 rounded-md px-2 py-1.5">
            <button
              type="button"
              onClick={() =>
                setAnchor(
                  new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1),
                )
              }
              aria-label="Previous month"
              className="calendar-icon-button text-jarvis-muted transition-colors hover:text-jarvis-cyan"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="hud-label min-w-32 text-center text-jarvis-cyan">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={() =>
                setAnchor(
                  new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1),
                )
              }
              aria-label="Next month"
              className="calendar-icon-button text-jarvis-muted transition-colors hover:text-jarvis-cyan"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              const current = new Date();
              setAnchor(current);
              setSelectedDate(current);
            }}
            className="calendar-utility-button hud-label rounded-md border border-jarvis-border px-3 py-2 text-jarvis-muted transition-colors hover:border-jarvis-cyan hover:text-jarvis-cyan"
          >
            TODAY
          </button>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="calendar-add-button hud-label flex items-center gap-2 rounded-md border border-jarvis-border-strong px-3 py-2 text-jarvis-cyan transition-colors hover:bg-jarvis-glow/20"
          >
            <Plus className="h-3.5 w-3.5" /> NEW EVENT
          </button>
        </div>
      </header>

      <div className="calendar-main-grid grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <HudPanel
          title={`MONTH CALENDAR / ${monthLabel}`}
          className="calendar-grid-panel min-w-0"
        >
          <div className="calendar-weekdays grid grid-cols-7 border-b border-jarvis-border">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <span
                key={day}
                className="hud-label px-2 py-3 text-center text-[0.58rem]"
              >
                {day}
              </span>
            ))}
          </div>
          <div className="calendar-grid grid grid-cols-7">
            {cells.map((day) => {
              const key = dateKey(day);
              const dayEvents = eventsByDay[key] ?? [];
              const inMonth = day.getMonth() === anchor.getMonth();
              const isToday = dateKey(day) === dateKey(today);
              const isSelected = key === dateKey(selectedDate);
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setSelectedDate(day)}
                  className={`calendar-day-cell ${inMonth ? "" : "is-muted"} ${isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""}`}
                >
                  <span className="calendar-day-header">
                    <span className="calendar-day-number">{day.getDate()}</span>
                  </span>
                  <span className="calendar-day-events">
                    {dayEvents.slice(0, 2).map((event) => (
                      <span
                        key={event.id}
                        className="calendar-day-event"
                        style={
                          {
                            "--event-color": event.color,
                          } as React.CSSProperties
                        }
                      >
                        <i />
                        <span className="calendar-day-event-title">
                          {event.title}
                        </span>
                      </span>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="calendar-more-events">
                        +{dayEvents.length - 2} MORE
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </HudPanel>

        <div className="calendar-side-column flex min-w-0 flex-col gap-4">
          <HudPanel
            title="TODAY'S SCHEDULE"
            className="calendar-schedule-panel p-4"
          >
            <div className="calendar-summary">
              <span className="hud-label">SELECTED DAY / {selectedLabel}</span>
              <strong className="hud-mono text-2xl text-jarvis-cyan">
                {selectedEvents.length.toString().padStart(2, "0")}
              </strong>
              <span className="hud-label">
                EVENT{selectedEvents.length === 1 ? "" : "S"} DETECTED
              </span>
            </div>
            <div className="calendar-selected-events">
              {selectedEvents.length === 0 ? (
                <div className="calendar-empty-state">
                  <CalendarDays className="h-7 w-7 text-jarvis-cyan opacity-60" />
                  <span className="hud-label">NO EVENTS DETECTED</span>
                  <span className="text-xs text-jarvis-muted">
                    Your schedule is clear.
                  </span>
                </div>
              ) : (
                selectedEvents.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    onDelete={() => deleteEvent(event.id)}
                  />
                ))
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelectedDate(today)}
              className="hud-label mt-4 border-t border-jarvis-border pt-3 text-left text-jarvis-cyan transition-colors hover:opacity-80"
            >
              VIEW TODAY <span className="opacity-50">→</span>
            </button>
          </HudPanel>
          <HudPanel
            title="UPCOMING EVENTS"
            className="calendar-upcoming-panel p-4"
          >
            {sorted.slice(0, 4).map((event) => (
              <EventRow
                key={event.id}
                event={event}
                onDelete={() => deleteEvent(event.id)}
              />
            ))}
            {sorted.length === 0 && (
              <span className="hud-label opacity-50">NO UPCOMING EVENTS</span>
            )}
          </HudPanel>
        </div>
      </div>

      {isLoading && (
        <span className="hud-label opacity-50">LOADING EVENTS...</span>
      )}
      {isCreateOpen && (
        <div
          className="calendar-modal-overlay fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onMouseDown={closeCreateModal}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-add-title"
            className="calendar-create-dialog hud-panel w-full max-w-lg rounded-lg p-5"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between border-b border-jarvis-border pb-3">
              <div>
                <span className="hud-label text-jarvis-cyan">
                  SCHEDULE MANAGEMENT
                </span>
                <h2
                  id="quick-add-title"
                  className="hud-display mt-1 text-lg tracking-[0.12em] text-jarvis-fg"
                >
                  QUICK ADD EVENT
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCreateModal}
                aria-label="Close add event dialog"
                className="calendar-modal-close hud-label text-jarvis-muted transition-colors hover:text-jarvis-cyan"
              >
                ESC
              </button>
            </div>
            <form
              onSubmit={handleCreate}
              className="calendar-quick-add flex flex-col gap-4"
            >
              <label className="flex flex-col gap-1.5">
                <span className="hud-label">EVENT TITLE</span>
                <input
                  ref={titleInputRef}
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="EVENT TITLE..."
                  className="hud-input hud-mono text-sm"
                />
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="hud-label">START DATE / TIME</span>
                  <DatePicker
                    selected={startAt}
                    onChange={(date: Date | null) => setStartAt(date)}
                    showTimeSelect
                    dateFormat="MMM d, yyyy h:mm aa"
                    placeholderText="SELECT DATE / TIME"
                    className="hud-input hud-mono w-full text-xs"
                    wrapperClassName="w-full"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="hud-label">END DATE / TIME</span>
                  <DatePicker
                    selected={endAt}
                    onChange={(date: Date | null) => setEndAt(date)}
                    showTimeSelect
                    dateFormat="MMM d, yyyy h:mm aa"
                    placeholderText="SELECT DATE / TIME"
                    className="hud-input hud-mono w-full text-xs"
                    wrapperClassName="w-full"
                  />
                </label>
              </div>
              <div className="mt-2 flex justify-end gap-3 border-t border-jarvis-border pt-4">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="hud-label rounded-md border border-jarvis-border px-4 py-2.5 text-jarvis-muted transition-colors hover:border-jarvis-border-strong hover:text-jarvis-fg"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={creating || !title.trim() || !startAt || !endAt}
                  className="calendar-submit-button hud-label flex items-center justify-center gap-2 rounded-md border border-jarvis-border-strong px-4 py-2.5 text-jarvis-cyan transition-colors hover:bg-jarvis-glow/20 disabled:opacity-30"
                >
                  <Plus className="h-4 w-4" />{" "}
                  {creating ? "ADDING..." : "ADD EVENT"}
                </button>
              </div>
              {createError && (
                <p className="calendar-create-error hud-label text-jarvis-crit">
                  {createError}
                </p>
              )}
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function EventRow({
  event,
  onDelete,
}: {
  event: {
    id: string;
    title: string;
    startAt: string;
    endAt: string;
    color: string;
  };
  onDelete: () => void;
}) {
  return (
    <div className="calendar-event-row group flex items-start gap-3 border-b border-jarvis-border py-3 last:border-b-0">
      <span
        className="calendar-event-dot mt-1.5 h-2 w-2 shrink-0 rounded-full"
        style={{ background: event.color, boxShadow: `0 0 6px ${event.color}` }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-jarvis-fg">{event.title}</p>
        <p className="hud-mono mt-1 text-[0.65rem] text-jarvis-muted">
          <Clock3 className="mr-1 inline h-3 w-3" />
          {new Date(event.startAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          →{" "}
          {new Date(event.endAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${event.title}`}
        className="calendar-delete-button shrink-0 text-jarvis-muted transition-colors hover:text-jarvis-crit"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
