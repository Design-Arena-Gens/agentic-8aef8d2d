"use client";

import { useMemo } from "react";
import type { WeightEntry } from "../lib/types";
import { format } from "../lib/date";

type ChartProps = {
  entries: WeightEntry[];
};

const height = 220;

export function WeightChart({ entries }: ChartProps) {
  const points = useMemo(() => {
    if (entries.length === 0) {
      return null;
    }

    const sorted = [...entries]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-90);

    const weights = sorted.map((entry) => entry.weight);
    const minWeight = Math.min(...weights) - 0.5;
    const maxWeight = Math.max(...weights) + 0.5;
    const range = maxWeight - minWeight || 1;

    const width = sorted.length > 1 ? (sorted.length - 1) * 36 : 36;
    const step = sorted.length > 1 ? width / (sorted.length - 1) : 0;

    const coords = sorted.map((entry, index) => {
      const x = index * step;
      const normalised = (entry.weight - minWeight) / range;
      const y = height - normalised * height;
      return { x, y, label: `${format(entry.date)} • ${entry.weight.toFixed(1)} kg` };
    });

    const polyline = coords.map((point) => `${point.x},${point.y}`).join(" ");

    const area = [
      `0,${height}`,
      ...coords.map((point) => `${point.x},${point.y}`),
      `${coords.at(-1)!.x},${height}`
    ].join(" ");

    return {
      polyline,
      area,
      coords,
      width: Math.max(width, 320),
      min: minWeight + 0.5,
      max: maxWeight - 0.5
    };
  }, [entries]);

  if (!points) {
    return (
      <div className="flex h-full min-h-[260px] flex-col justify-center rounded-3xl border border-dashed border-white/10 bg-surface/60 p-8 text-center text-sm text-neutral-500">
        Add at least two entries to unlock the trend chart.
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-surface/70 p-6 shadow-glow">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Weight Trend</h2>
          <p className="text-sm text-neutral-500">Last {points.coords.length} entries</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-400">
          {points.min.toFixed(1)} – {points.max.toFixed(1)} kg
        </div>
      </header>

      <div className="relative">
        <svg
          viewBox={`0 0 ${points.width} ${height}`}
          className="h-56 w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Weight chart"
        >
          <defs>
            <linearGradient id="weightLine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(108, 92, 231, 0.4)" />
              <stop offset="100%" stopColor="rgba(108, 92, 231, 0.05)" />
            </linearGradient>
          </defs>

          <path d={`M${points.area}Z`} fill="url(#weightLine)" />
          <polyline
            points={points.polyline}
            fill="none"
            stroke="rgba(162, 155, 254, 1)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {points.coords.map((point) => (
            <g key={`${point.x}-${point.y}`} transform={`translate(${point.x},${point.y})`}>
              <circle r="4" fill="#81ecec" />
            </g>
          ))}
        </svg>
        <div className="mt-4 grid gap-2 text-xs text-neutral-500 md:grid-cols-2 lg:grid-cols-3">
          {points.coords.slice(-6).map((point) => (
            <div key={point.label} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
              {point.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
