"use client"

const examples = [
  { label: "Basic Tree", value: "A->B, A->C, B->D" },
  { label: "Deep Tree", value: "A->B, B->C, C->D, D->E" },
  { label: "Cycle", value: "X->Y, Y->Z, Z->X" },
  { label: "Mixed", value: "A->B, A->C, B->D, C->E, E->F, X->Y, Y->Z, Z->X, P->Q, Q->R" },
  { label: "Duplicates", value: "G->H, G->H, G->H, G->I" },
  { label: "Invalid", value: "hello, 1->2, A->, A->B, AB->C" },
  { label: "Full Example", value: "A->B, A->C, B->D, C->E, E->F, X->Y, Y->Z, Z->X, P->Q, Q->R, G->H, G->H, G->I, hello, 1->2, A->" },
  { label: "Diamond", value: "A->D, B->D, A->C, B->E" },
  { label: "Self Loop", value: "A->A, B->C" },
]

export function ExamplesBar({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
      {examples.map(ex => (
        <button
          key={ex.label}
          className="shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
          onClick={() => onSelect(ex.value)}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--card-hover)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--card)")}
        >
          {ex.label}
        </button>
      ))}
    </div>
  )
}
