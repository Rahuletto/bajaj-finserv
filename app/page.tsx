"use client";

import { useState } from "react";
import { LuTriangleAlert } from "react-icons/lu";
import { ThemeToggle } from "./components/theme-toggle";
import { ExamplesBar } from "./components/examples-bar";
import { SummaryCards } from "./components/summary-cards";
import { HierarchyCard } from "./components/hierarchy-card";
import { BadgeList } from "./components/badge-list";
import { JsonView } from "./components/json-view";
import { MermaidGraph } from "./components/mermaid-graph";
import { Footer } from "./components/footer";

type Result = {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: {
    root: string;
    tree: Record<string, unknown>;
    edges: [string, string][];
    depth?: number;
    has_cycle?: true;
  }[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: {
    total_trees: number;
    total_cycles: number;
    largest_tree_root: string;
  };
};

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setResult(null);

    const items = input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (items.length === 0) {
      setError("Enter at least one entry");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: items }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Something went wrong");
        return;
      }
      setResult(await res.json());
    } catch {
      setError("Failed to reach API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
        style={{ color: "var(--foreground)" }}
      >
        <div className="flex items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Node Hierarchy
            </h1>
            <p
              className="mt-1 text-xs sm:text-sm"
              style={{ color: "var(--muted)" }}
            >
              This parses the edges and builds a tree and can detect cycles too.
              How cool
            </p>
          </div>
          <ThemeToggle />
        </div>

        <ExamplesBar onSelect={setInput} />

        <textarea
          className="w-full rounded-lg p-3 sm:p-4 text-sm outline-none resize-none transition-colors"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
          rows={3}
          placeholder="A->B, A->C, B->D, ..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />

        <button
          className="mt-3 w-full sm:w-auto px-5 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-40"
          style={{
            background: "var(--foreground)",
            color: "var(--background)",
          }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit"}
        </button>

        {error && (
          <div
            className="mt-4 flex items-center gap-2 text-sm font-medium"
            style={{ color: "var(--badge-red-text)" }}
          >
            <LuTriangleAlert size={14} />
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            <div
              className="flex flex-wrap gap-x-2 gap-y-1 text-xs"
              style={{ color: "var(--muted)" }}
            >
              <span>{result.user_id}</span>
              <span>·</span>
              <span>{result.email_id}</span>
              <span>·</span>
              <span>{result.college_roll_number}</span>
            </div>

            <SummaryCards summary={result.summary} />

            <MermaidGraph hierarchies={result.hierarchies} />

            <div>
              <h2 className="text-lg font-semibold mb-3">Hierarchies</h2>
              <div className="space-y-3">
                {result.hierarchies.map((h, i) => (
                  <HierarchyCard key={i} h={h} />
                ))}
              </div>
            </div>

            <BadgeList
              title="Invalid Entries"
              items={result.invalid_entries}
              variant="red"
            />
            <BadgeList
              title="Duplicate Edges"
              items={result.duplicate_edges}
              variant="yellow"
            />
            <JsonView data={result} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
