"use client";

import { useState, type KeyboardEvent, type PointerEvent, type CSSProperties } from "react";
import { EnvelopeSimple, GithubLogo } from "@phosphor-icons/react";
import {
  activityDays, activityDateLabel, activityDescription, activityLevel,
  type NewsletterActivity,
} from "@/lib/activity-calendar";

export function ActivityCalendar({ activity, today }: { activity: NewsletterActivity; today: string }) {
  const days = activityDays(activity, today);
  const lastDay = days.findLastIndex(day => !day.future);
  const latestEmail = Object.keys(activity.email.counts).filter(date => date <= today).sort().at(-1);
  const [selected, setSelected] = useState(() => {
    const email = days.findLastIndex(day => !day.future && (day.emails ?? 0) > 0);
    return email >= 0 ? email : lastDay;
  });
  const [hovered, setHovered] = useState<number | null>(null);
  const current = days[hovered ?? selected];
  const weeks = Array.from({ length: 12 }, (_, index) => days.slice(index * 7, index * 7 + 7));
  const monthLabels = weeks.map((week, index) => {
    // Midweek dates avoid squeezing a label in for a partial opening month.
    const month = week[3].date.slice(0, 7);
    return index === 0 || month !== weeks[index - 1][3].date.slice(0, 7)
      ? activityDateLabel(week[3].date, { month: "short", day: undefined }) : "";
  });

  function dayAtPointer(event: PointerEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const column = Math.max(0, Math.min(11, Math.floor((event.clientX - bounds.left) / bounds.width * 12)));
    const row = Math.max(0, Math.min(6, Math.floor((event.clientY - bounds.top) / bounds.height * 7)));
    const index = column * 7 + row;
    return index <= lastDay ? index : null;
  }

  function choose(index: number) {
    setSelected(Math.max(0, Math.min(lastDay, index)));
    setHovered(null);
  }

  function move(event: KeyboardEvent<HTMLButtonElement>) {
    const steps: Record<string, number> = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 };
    if (event.key in steps) { event.preventDefault(); choose(selected + steps[event.key]); }
    else if (event.key === "Home" || event.key === "End") {
      event.preventDefault(); choose(event.key === "Home" ? 0 : lastDay);
    }
  }

  return (
    <section className="activity-calendar" aria-labelledby="activity-title">
      <h2 id="activity-title">Lately</h2>
      <div className="activity-months" aria-hidden="true">
        {monthLabels.map((label, index) => <span key={index} style={{ gridColumn: index + 1 }}>{label}</span>)}
      </div>
      <div className="activity-layout">
        <div className="activity-weekdays" aria-hidden="true">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((label, index) => <span key={index}>{label}</span>)}
        </div>
        <div className="activity-plot">
          <div className="activity-cells" aria-hidden="true">
            {days.map((day, index) => (
              <span
                key={day.date}
                className="activity-day"
                data-date={day.date}
                data-level={activityLevel(day.commits)}
                data-email={(day.emails ?? 0) > 0 || undefined}
                data-selected={index === (hovered ?? selected) || undefined}
                data-future={day.future || undefined}
                data-unavailable={day.commits === null || undefined}
              >
                {(day.emails ?? 0) > 0 && <EnvelopeSimple weight="regular" aria-hidden="true" />}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="activity-explore"
            aria-label={`Explore activity. ${activityDateLabel(days[selected].date)}: ${activityDescription(days[selected])}.`}
            aria-describedby="activity-keyboard-help"
            onKeyDown={move}
            onPointerMove={event => { if (event.pointerType === "mouse") setHovered(dayAtPointer(event)); }}
            onPointerLeave={() => setHovered(null)}
            onPointerDown={event => { const index = dayAtPointer(event); if (index !== null) choose(index); }}
          />
        </div>
      </div>
      <p className="sr-only" id="activity-keyboard-help">Tap a day or use the arrow keys to explore. Left and right move a week; up and down move a day. Home and End move to the first and last day.</p>
      <span className="sr-only" role="status">{activityDateLabel(days[selected].date)}: {activityDescription(days[selected])}</span>
      <div className="activity-legend">
        <span><span className="activity-scale" aria-hidden="true">{[1, 2, 3, 4].map(level => <i key={level} style={{ "--activity-level": `var(--activity-level-${level})` } as CSSProperties} />)}</span>Commits</span>
        <span><EnvelopeSimple size={16} aria-hidden="true" />Email sent</span>
      </div>
      <div className="activity-selection">
        <time dateTime={current.date}>{activityDateLabel(current.date, { weekday: "short" })}</time>
        <p>{activityDescription(current)}</p>
      </div>
      {latestEmail && (
        <p className="activity-latest"><EnvelopeSimple size={18} aria-hidden="true" /><span>Last email sent <time dateTime={latestEmail}>{activityDateLabel(latestEmail, { month: "long", year: "numeric" })}</time>.</span></p>
      )}
      <p className="activity-sources">
        <GithubLogo size={16} aria-hidden="true" />
        <span>{activity.accounts.map((account, index) => <span key={account}>{index > 0 && " + "}<a href={`https://github.com/${account}`} target="_blank" rel="noopener noreferrer">{account}</a></span>)}<span className="activity-through"> · Through {activityDateLabel(activity.github.through)}</span></span>
      </p>
      {activity.email.through < today && <p className="activity-caption">Email history through {activityDateLabel(activity.email.through)}.</p>}
    </section>
  );
}
