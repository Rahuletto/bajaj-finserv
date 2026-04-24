"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "../providers/theme"

type Hierarchy = {
  root: string
  tree: Record<string, unknown>
  edges: [string, string][]
  depth?: number
  has_cycle?: true
}

function buildMermaidCode(hierarchies: Hierarchy[]): string {
  const lines = ["graph TD"]
  const roots: string[] = []
  const cycleNodes: string[] = []

  for (let h of hierarchies) {
    for (let [from, to] of h.edges) {
      lines.push(`  ${from} --> ${to}`)
    }

    if (h.has_cycle) {
      for (let [from, to] of h.edges) {
        if (!cycleNodes.includes(from)) cycleNodes.push(from)
        if (!cycleNodes.includes(to)) cycleNodes.push(to)
      }
    } else {
      roots.push(h.root)
    }
  }

  for (let r of roots) lines.push(`  ${r}:::rootNode`)
  for (let c of cycleNodes) lines.push(`  ${c}:::cycleNode`)

  lines.push("")
  lines.push("  classDef rootNode fill:#1a7f37,stroke:#1a7f37,color:#fff")
  lines.push("  classDef cycleNode fill:#cf222e,stroke:#cf222e,color:#fff")

  return lines.join("\n")
}

export function MermaidGraph({ hierarchies }: { hierarchies: Hierarchy[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    let cancelled = false

    async function render() {
      if (!containerRef.current) return

      try {
        const mermaid = (await import("mermaid")).default

        mermaid.initialize({
          startOnLoad: false,
          theme: theme === "dark" ? "dark" : "default",
          flowchart: { curve: "basis", padding: 16 },
          securityLevel: "loose",
        })

        const code = buildMermaidCode(hierarchies)
        const id = `mermaid-${Date.now()}`
        const { svg } = await mermaid.render(id, code)

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch {
        if (!cancelled) setError(true)
      }
    }

    setError(false)
    render()

    return () => { cancelled = true }
  }, [hierarchies, theme])

  if (error) return null

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Graph</h2>
      <div
        className="rounded-lg p-4 overflow-auto"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div ref={containerRef} className="flex justify-center" />
      </div>
      <div className="flex gap-3 mt-2 text-xs" style={{ color: "var(--muted)" }}>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "#1a7f37" }} />
          Root
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "#cf222e" }} />
          Cycle
        </span>
      </div>
    </div>
  )
}
