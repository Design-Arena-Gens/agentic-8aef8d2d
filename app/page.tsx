"use client";

import { useEffect, useMemo, useState } from "react";
import { EntryForm, type WeightEntryInput } from "../components/EntryForm";
import { EntryList } from "../components/EntryList";
import { WeightChart } from "../components/WeightChart";
import { Stats } from "../components/Stats";
import { loadEntries, nextId, saveEntries } from "../lib/storage";
import type { WeightEntry } from "../lib/types";

const initialLoad = (): WeightEntry[] => loadEntries();

export default function Page() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);

  useEffect(() => {
    setEntries(initialLoad());
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      saveEntries(entries);
    }
  }, [entries]);

  const handleSave = (input: WeightEntryInput) => {
    setEntries((prev) => {
      const next: WeightEntry[] = [
        {
          id: nextId(),
          ...input
        },
        ...prev.filter((entry) => entry.date !== input.date)
      ];

      return next.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => {
      const next = prev.filter((entry) => entry.id !== id);
      saveEntries(next);
      return next;
    });
  };

  const streak = useMemo(() => calculateStreak(entries), [entries]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10">
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            WeightLine
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Minimal weight tracking,{" "}
            <span className="bg-gradient-to-r from-accent to-accentMuted bg-clip-text text-transparent">
              privacy first.
            </span>
          </h1>
          <p className="max-w-xl text-neutral-400">
            A lightweight dashboard for monitoring your weight trends. Entries are saved locally
            so only you can see them.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-neutral-500">
          <span className="rounded-full border border-white/10 px-3 py-1">
            {entries.length} total entries
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            {streak} day streak
          </span>
        </div>
      </header>

      <Stats entries={entries} />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <EntryForm onSave={handleSave} />
        <WeightChart entries={entries} />
      </section>

      <section className="pb-12">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">History</h2>
          <button
            type="button"
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-neutral-500 transition hover:border-critical hover:text-critical"
            onClick={() => {
              setEntries([]);
              saveEntries([]);
            }}
          >
            Clear All
          </button>
        </div>
        <EntryList entries={entries} onDelete={handleDelete} />
      </section>
    </main>
  );
}

function calculateStreak(entries: WeightEntry[]) {
  if (entries.length === 0) {
    return 0;
  }

  const byDate = new Map<string, WeightEntry>();
  entries.forEach((entry) => {
    byDate.set(entry.date, entry);
  });

  let streak = 0;
  let current = new Date();

  while (true) {
    const key = current.toISOString().slice(0, 10);
    if (!byDate.has(key)) {
      break;
    }

    streak += 1;
    current = new Date(current.getTime() - 24 * 60 * 60 * 1000);
  }

  return streak;
}
