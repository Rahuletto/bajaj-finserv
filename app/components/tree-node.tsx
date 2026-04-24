"use client"

import { useState } from "react"
import { FiChevronRight, FiChevronDown } from "react-icons/fi"
import { LuCircleDot } from "react-icons/lu"

export function TreeNode({ name, children, isRoot = false }: {
  name: string
  children: Record<string, unknown>
  isRoot?: boolean
}) {
  const keys = Object.keys(children)
  const hasKids = keys.length > 0
  const [open, setOpen] = useState(true)

  return (
    <div className={isRoot ? "" : "ml-4"}>
      <button
        className="flex items-center gap-1.5 py-1 px-1.5 rounded-md text-sm hover:opacity-70 transition-opacity"
        onClick={() => hasKids && setOpen(!open)}
      >
        {hasKids ? (
          open
            ? <FiChevronDown size={14} style={{ color: "var(--muted)" }} />
            : <FiChevronRight size={14} style={{ color: "var(--muted)" }} />
        ) : (
          <LuCircleDot size={12} style={{ color: "var(--muted)" }} className="ml-0.5 mr-0.5" />
        )}
        <span className="font-semibold">{name}</span>
        {isRoot && (
          <span className="text-xs ml-1" style={{ color: "var(--muted)" }}>root</span>
        )}
      </button>
      {open && hasKids && (
        <div className="border-l ml-2.5" style={{ borderColor: "var(--border)" }}>
          {keys.map(k => (
            <TreeNode key={k} name={k} children={children[k] as Record<string, unknown>} />
          ))}
        </div>
      )}
    </div>
  )
}
