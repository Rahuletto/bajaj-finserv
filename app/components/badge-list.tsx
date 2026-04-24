"use client"

type Variant = "red" | "yellow"

const styles: Record<Variant, { bg: string, color: string }> = {
  red: { bg: "var(--badge-red)", color: "var(--badge-red-text)" },
  yellow: { bg: "var(--badge-yellow)", color: "var(--badge-yellow-text)" },
}

export function BadgeList({ title, items, variant }: {
  title: string
  items: string[]
  variant: Variant
}) {
  if (items.length === 0) return null

  const s = styles[variant]

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span
            key={i}
            className="text-xs px-2 py-1 rounded-md font-medium"
            style={{ background: s.bg, color: s.color }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
