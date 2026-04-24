type TreeNode = { [key: string]: TreeNode }

type Hierarchy = {
  root: string
  tree: TreeNode
  depth?: number
  has_cycle?: true
}

export type BfhlResult = {
  user_id: string
  email_id: string
  college_roll_number: string
  hierarchies: Hierarchy[]
  invalid_entries: string[]
  duplicate_edges: string[]
  summary: {
    total_trees: number
    total_cycles: number
    largest_tree_root: string
  }
}

function isValidEdge(s: string): boolean {
  return /^[A-Z]->[A-Z]$/.test(s)
}

function makeTree(node: string, adj: Map<string, string[]>): TreeNode {
  const kids = adj.get(node) || []
  const obj: TreeNode = {}
  for (let k of kids) {
    obj[k] = makeTree(k, adj)
  }
  return obj
}

function getDepth(node: string, adj: Map<string, string[]>): number {
  const children = adj.get(node) || []
  if (children.length === 0) return 1
  let max = 0
  for (let c of children) {
    const d = getDepth(c, adj)
    if (d > max) max = d
  }
  return max + 1
}

function hasCycle(nodes: Set<string>, adj: Map<string, string[]>): boolean {
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

function findComponents(
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

export function processBfhl(data: string[]): BfhlResult {
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

  const components = findComponents(allNodes, usedEdges)
  const hierarchies: Hierarchy[] = []

  for (let comp of components) {
    const roots = [...comp].filter(n => !childSet.has(n)).sort()

    if (hasCycle(comp, adj)) {
      const root = [...comp].sort()[0]
      hierarchies.push({ root, tree: {}, has_cycle: true })
    } else {
      const root = roots[0]
      const tree: TreeNode = { [root]: makeTree(root, adj) }
      const depth = getDepth(root, adj)
      hierarchies.push({ root, tree, depth })
    }
  }

  const treesOnly = hierarchies.filter(h => !h.has_cycle)
  const cycleCount = hierarchies.filter(h => h.has_cycle).length

  let bestRoot = ""
  let bestDepth = 0
  for (let t of treesOnly) {
    const d = t.depth!
    if (d > bestDepth || (d === bestDepth && t.root < bestRoot)) {
      bestDepth = d
      bestRoot = t.root
    }
  }

  return {
    user_id: process.env.USER_ID || "",
    email_id: process.env.EMAIL_ID || "",
    college_roll_number: process.env.COLLEGE_ROLL || "",
    hierarchies,
    invalid_entries: invalid,
    duplicate_edges: dupes,
    summary: {
      total_trees: treesOnly.length,
      total_cycles: cycleCount,
      largest_tree_root: bestRoot,
    },
  }
}
