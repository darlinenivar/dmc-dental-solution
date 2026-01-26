// src/components/MiniCalendar.jsx
import React, { useMemo, useState } from "react";

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d, n) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function MiniCalendar({ title = "Calendario" }) {
  const [cursor, setCursor] = useState(() => new Date());
  const today = useMemo(() => new Date(), []);

  const { monthLabel, days } = useMemo(() => {
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);

    const monthLabel = start.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });

    // grid 7 cols, start at Monday
    const startWeekDay = (start.getDay() + 6) % 7; // Mon=0..Sun=6
    const totalDays = end.getDate();

    const cells = [];
    for (let i = 0; i < startWeekDay; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(new Date(start.getFullYear(), start.getMonth(), d));
    while (cells.length % 7 !== 0) cells.push(null);

    return { monthLabel, days: cells };
  }, [cursor]);

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="card-title">{title}</div>
          <div className="card-sub">{monthLabel}</div>
        </div>

        <div className="cal-actions">
          <button className="btn-ghost" onClick={() => setCursor(addMonths(cursor, -1))} type="button">
            ◀
          </button>
          <button className="btn-ghost" onClick={() => setCursor(new Date())} type="button">
            Hoy
          </button>
          <button className="btn-ghost" onClick={() => setCursor(addMonths(cursor, 1))} type="button">
            ▶
          </button>
        </div>
      </div>

      <div className="cal-week">
        {["L", "M", "M", "J", "V", "S", "D"].map((w) => (
          <div key={w} className="cal-weekday">
            {w}
          </div>
        ))}
      </div>

      <div className="cal-grid">
        {days.map((d, idx) => {
          if (!d) return <div key={idx} className="cal-cell empty" />;

          const isToday = sameDay(d, today);
          return (
            <div key={idx} className={`cal-cell ${isToday ? "today" : ""}`}>
              {d.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
