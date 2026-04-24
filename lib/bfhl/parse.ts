function isValidEdge(s: string): boolean {
  return /^[A-Z]->[A-Z]$/.test(s)
}

export function parseEdges(data: string[]) {
  const invalid: string[] = []
  const dupes: string[] = []
  const seen = new Set<string>()
  const edges: [string, string][] = []

  for (let i = 0; i < data.length; i++) {
    const entry = data[i].trim()

    if (!isValidEdge(entry)) {
      invalid.push(entry)
      continue
    }

    const parts = entry.split("->")
    const parent = parts[0], child = parts[1]

    if (parent === child) {
      invalid.push(entry)
      continue
    }

    if (seen.has(entry)) {
      if (!dupes.includes(entry)) dupes.push(entry)
      continue
    }
    seen.add(entry)
    edges.push([parent, child])
  }

  return { edges, invalid, dupes }
}
