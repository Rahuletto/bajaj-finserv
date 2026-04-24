"use client"

import { LuCopy } from "react-icons/lu"

function JsonNode({ value, indent }: { value: unknown, indent: number }) {
  const pad = "  ".repeat(indent)
  const inner = "  ".repeat(indent + 1)

  if (value === null || value === undefined) return <span style={{ color: "var(--muted)" }}>null</span>
  if (typeof value === "boolean") return <span style={{ color: "var(--json-bool)" }}>{String(value)}</span>
  if (typeof value === "number") return <span style={{ color: "var(--json-number)" }}>{value}</span>
  if (typeof value === "string") return <span style={{ color: "var(--json-string)" }}>&quot;{value}&quot;</span>

  if (Array.isArray(value)) {
    if (value.length === 0) return <>{"[]"}</>
    return (
      <>
        {"[\n"}
        {value.map((item, i) => (
          <span key={i}>
            {inner}<JsonNode value={item} indent={indent + 1} />
            {i < value.length - 1 ? ",\n" : "\n"}
          </span>
        ))}
        {pad}{"]"}
      </>
    )
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return <>{"{}"}</>
    return (
      <>
        {"{\n"}
        {entries.map(([key, val], i) => (
          <span key={key}>
            {inner}<span style={{ color: "var(--json-key)" }}>&quot;{key}&quot;</span>: <JsonNode value={val} indent={indent + 1} />
            {i < entries.length - 1 ? ",\n" : "\n"}
          </span>
        ))}
        {pad}{"}"}
      </>
    )
  }

  return <>{String(value)}</>
}

export function JsonView({ data }: { data: unknown }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Raw Response</h2>
        <button
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors"
          style={{ color: "var(--muted)", border: "1px solid var(--border)" }}
          onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
        >
          <LuCopy size={12} /> Copy
        </button>
      </div>
      <pre
        className="rounded-lg p-4 text-xs overflow-auto max-h-[500px] leading-5"
        style={{ background: "var(--code-bg)" }}
      >
        <JsonNode value={data} indent={0} />
      </pre>
    </div>
  )
}
