"use client"

import { LuTreePine, LuRefreshCw } from "react-icons/lu"
import { TreeNode } from "./tree-node"

type Hierarchy = {
  root: string
  tree: Record<string, unknown>
  depth?: number
  has_cycle?: true
}

export function HierarchyCard({ h }: { h: Hierarchy }) {
  return (
    <div
      className="rounded-lg p-4"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        {h.has_cycle ? (
          <LuRefreshCw size={16} style={{ color: "var(--badge-red-text)" }} />
        ) : (
          <LuTreePine size={16} style={{ color: "var(--badge-green-text)" }} />
        )}
        <span className="font-semibold text-base">{h.root}</span>
        {h.has_cycle ? (
          <span
            className="text-xs px-2 py-0.5 rounded-md font-medium"
            style={{ background: "var(--badge-red)", color: "var(--badge-red-text)" }}
          >
            cycle
          </span>
        ) : (
          <span
            className="text-xs px-2 py-0.5 rounded-md font-medium"
            style={{ background: "var(--badge-green)", color: "var(--badge-green-text)" }}
          >
            depth {h.depth}
          </span>
        )}
      </div>
      {h.has_cycle ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Cyclic group — no tree structure
        </p>
      ) : (
        <div className="text-sm">
          {Object.keys(h.tree).map(root => (
            <TreeNode
              key={root}
              name={root}
              children={h.tree[root] as Record<string, unknown>}
              isRoot
            />
          ))}
        </div>
      )}
    </div>
  )
}
