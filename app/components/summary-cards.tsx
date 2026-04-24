"use client"

import { LuTreePine, LuRefreshCw, LuCircleDot } from "react-icons/lu"

type Summary = {
  total_trees: number
  total_cycles: number
  largest_tree_root: string
}

export function SummaryCards({ summary }: { summary: Summary }) {
  const items = [
    { label: "Trees", value: summary.total_trees, icon: <LuTreePine size={14} /> },
    { label: "Cycles", value: summary.total_cycles, icon: <LuRefreshCw size={14} /> },
    { label: "Largest Root", value: summary.largest_tree_root || "—", icon: <LuCircleDot size={14} /> },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {items.map(item => (
        <div
          key={item.label}
          className="rounded-lg p-4"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-1.5 mb-1" style={{ color: "var(--muted)" }}>
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </div>
          <div className="text-2xl font-bold">{item.value}</div>
        </div>
      ))}
    </div>
  )
}
