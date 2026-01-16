"use client";

import { format } from "../lib/date";
import type { WeightEntry } from "../lib/types";

type EntryListProps = {
  entries: WeightEntry[];
  onDelete: (id: string) => void;
};

export function EntryList({ entries, onDelete }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-surface/60 p-12 text-center text-sm text-neutral-500">
        No entries yet. Add your first weight to start the timeline.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-surface/60 shadow-glow">
      <table className="min-w-full divide-y divide-white/5 text-sm">
        <thead className="bg-white/5 uppercase tracking-wide text-neutral-500">
          <tr>
            <th scope="col" className="px-4 py-3 text-left font-semibold">
              Date
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Weight (kg)
            </th>
            <th scope="col" className="hidden px-4 py-3 text-left font-semibold md:table-cell">
              Note
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-neutral-200">
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-white/5">
              <td className="px-4 py-3 font-medium text-white">{format(entry.date)}</td>
              <td className="px-4 py-3 text-right text-base font-semibold">
                {entry.weight.toFixed(1)}
              </td>
              <td className="hidden px-4 py-3 text-left text-neutral-400 md:table-cell">
                {entry.note || "—"}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-400 transition hover:border-critical hover:text-critical"
                  onClick={() => onDelete(entry.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
