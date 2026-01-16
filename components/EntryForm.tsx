"use client";

import { useState } from "react";
import classNames from "classnames";

export type WeightEntryInput = {
  date: string;
  weight: number;
  note: string;
};

type EntryFormProps = {
  onSave: (entry: WeightEntryInput) => void;
};

const today = () => new Date().toISOString().slice(0, 10);

export function EntryForm({ onSave }: EntryFormProps) {
  const [date, setDate] = useState<string>(today());
  const [weight, setWeight] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const floatWeight = parseFloat(weight);

    if (!Number.isFinite(floatWeight) || floatWeight <= 0) {
      setError("Enter a positive number");
      return;
    }

    if (!date) {
      setError("Pick a date");
      return;
    }

    onSave({
      date,
      weight: parseFloat(floatWeight.toFixed(1)),
      note: note.trim()
    });

    setWeight("");
    setNote("");
    setError(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-3xl bg-surface/70 p-6 shadow-glow backdrop-blur"
    >
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Log Today&apos;s Weight</h2>
          <p className="text-sm text-neutral-400">
            Entries stay on this device. Keep consistent to see meaningful trends.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm text-neutral-300">
          Date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            max={today()}
            className="rounded-2xl border border-white/10 bg-surface px-4 py-3 text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/40"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-neutral-300">
          Weight
          <div
            className={classNames(
              "flex items-center gap-2 rounded-2xl border px-4 py-3 text-white transition focus-within:ring-2",
              {
                "border-accent focus-within:ring-accent/40": !error,
                "border-critical focus-within:ring-critical/40": Boolean(error)
              }
            )}
          >
            <input
              inputMode="decimal"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="e.g. 72.4"
              autoComplete="off"
              className="flex-1 bg-transparent text-base outline-none placeholder:text-neutral-600"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "weight-error" : undefined}
              required
            />
            <span className="text-sm text-neutral-500">kg</span>
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm text-neutral-300 md:col-span-1">
          Note <span className="text-xs text-neutral-500">(optional)</span>
          <input
            value={note}
            maxLength={60}
            onChange={(event) => setNote(event.target.value)}
            placeholder="e.g. long run today"
            className="rounded-2xl border border-white/10 bg-surface px-4 py-3 text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/40"
          />
        </label>
      </div>

      {error ? (
        <p id="weight-error" className="text-sm font-medium text-critical">
          {error}
        </p>
      ) : null}

      <footer className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-neutral-500">
          Tip: small fluctuations (≤1kg) are normal. Focus on the overall direction.
        </p>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2 text-sm font-semibold text-white transition hover:bg-accentMuted"
        >
          Save Entry
        </button>
      </footer>
    </form>
  );
}
