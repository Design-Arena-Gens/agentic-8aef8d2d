"use client";

import { useMemo } from "react";
import type { WeightEntry } from "../lib/types";

type StatsProps = {
  entries: WeightEntry[];
};

const computeChange = (current: number | null, previous: number | null) => {
  if (current === null || previous === null) {
    return null;
  }

  return Number((current - previous).toFixed(1));
};

const formatChange = (value: number | null) => {
  if (value === null) {
    return "—";
  }

  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} kg`;
};

const colorForChange = (value: number | null) => {
  if (value === null) {
    return "text-neutral-400";
  }

  if (value < 0) {
    return "text-positive";
  }

  if (value > 0) {
    return "text-critical";
  }

  return "text-neutral-400";
};

export function Stats({ entries }: StatsProps) {
  const { latestWeight, entriesCount, weekChange, monthChange, trend } = useMemo(() => {
    if (entries.length === 0) {
      return {
        latestWeight: null,
        entriesCount: 0,
        weekChange: null,
        monthChange: null,
        trend: "—"
      };
    }

    const sorted = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const latest = sorted[0].weight;
    const weekAgo = sorted.find(
      (entry) => new Date().getTime() - new Date(entry.date).getTime() >= 6 * 24 * 3600 * 1000
    );
    const monthAgo = sorted.find(
      (entry) => new Date().getTime() - new Date(entry.date).getTime() >= 29 * 24 * 3600 * 1000
    );

    const weekDelta = computeChange(latest, weekAgo?.weight ?? null);
    const monthDelta = computeChange(latest, monthAgo?.weight ?? null);

    const oldest = sorted.at(-1)?.weight ?? latest;
    const totalDelta = computeChange(latest, oldest);

    const trendLabel =
      totalDelta === null
        ? "—"
        : totalDelta < 0
          ? "Downward"
          : totalDelta > 0
            ? "Upward"
            : "Stable";

    return {
      latestWeight: latest,
      entriesCount: entries.length,
      weekChange: weekDelta,
      monthChange: monthDelta,
      trend: trendLabel
    };
  }, [entries]);

  const statItems = [
    {
      label: "Latest Weight",
      value: latestWeight ? `${latestWeight.toFixed(1)} kg` : "—",
      sublabel: entriesCount ? `${entriesCount} logged` : "Log your first entry"
    },
    {
      label: "Past 7 Days",
      value: formatChange(weekChange),
      sublabel: "Short-term change",
      accent: colorForChange(weekChange)
    },
    {
      label: "Past 30 Days",
      value: formatChange(monthChange),
      sublabel: "Medium-term trend",
      accent: colorForChange(monthChange)
    },
    {
      label: "Overall Trend",
      value: trend,
      sublabel: "Based on all entries",
      accent: trend === "Downward" ? "text-positive" : trend === "Upward" ? "text-critical" : "text-neutral-400"
    }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statItems.map((item) => (
        <article
          key={item.label}
          className="rounded-3xl border border-white/5 bg-surface/70 p-5 transition hover:border-accent/40"
        >
          <p className="text-xs uppercase tracking-wide text-neutral-500">{item.label}</p>
          <p className={`mt-3 text-2xl font-semibold ${item.accent ?? "text-white"}`}>{item.value}</p>
          <p className="mt-2 text-xs text-neutral-500">{item.sublabel}</p>
        </article>
      ))}
    </section>
  );
}
