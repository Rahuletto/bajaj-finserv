export function buildAdjList(edges: [string, string][]) {
  const adj = new Map<string, string[]>()
  const allNodes = new Set<string>()
  const childSet = new Set<string>()
  const usedEdges: [string, string][] = []
  const parentOf = new Map<string, string>()

  for (let [p, c] of edges) {
    allNodes.add(p)
    allNodes.add(c)

    if (parentOf.has(c)) continue

    parentOf.set(c, p)
    childSet.add(c)
    if (!adj.has(p)) adj.set(p, [])
    adj.get(p)!.push(c)
    usedEdges.push([p, c])
  }

  return { adj, allNodes, childSet, usedEdges }
}

export function findComponents(
  nodes: Set<string>,
  edges: [string, string][]
): Set<string>[] {
  const graph = new Map<string, Set<string>>()
  for (let n of nodes) graph.set(n, new Set())

  for (let [a, b] of edges) {
    graph.get(a)!.add(b)
    graph.get(b)!.add(a)
  }

  const seen = new Set<string>()
  const groups: Set<string>[] = []

  for (let n of nodes) {
    if (seen.has(n)) continue
    const group = new Set<string>()
    const queue = [n]
    while (queue.length) {
      let cur = queue.shift()!
      if (seen.has(cur)) continue
      seen.add(cur)
      group.add(cur)
      for (let nb of graph.get(cur)!) {
        if (!seen.has(nb)) queue.push(nb)
      }
    }
    groups.push(group)
  }

  return groups
}

export function hasCycle(nodes: Set<string>, adj: Map<string, string[]>): boolean {
  const colors = new Map<string, number>()
  for (let n of nodes) colors.set(n, 0)

  function visit(n: string): boolean {
    colors.set(n, 1)
    const neighbors = adj.get(n) || []
    for (let nb of neighbors) {
      if (!nodes.has(nb)) continue
      if (colors.get(nb) === 1) return true
      if (colors.get(nb) === 0 && visit(nb)) return true
    }
    colors.set(n, 2)
    return false
  }

  for (let n of nodes) {
    if (colors.get(n) === 0 && visit(n)) return true
  }
  return false
}
