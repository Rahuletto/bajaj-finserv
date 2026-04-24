import { parseEdges } from "./parse"
import { buildAdjList, findComponents, hasCycle } from "./graph"
import { makeTree, getDepth } from "./tree"

type Hierarchy = {
  root: string
  tree: Record<string, unknown>
  edges: [string, string][]
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

export function processBfhl(data: string[]): BfhlResult {
  const { edges, invalid, dupes } = parseEdges(data)
  const { adj, allNodes, childSet, usedEdges } = buildAdjList(edges)
  const components = findComponents(allNodes, usedEdges)

  const hierarchies: Hierarchy[] = []

  for (let comp of components) {
    const roots = [...comp].filter(n => !childSet.has(n)).sort()
    const compEdges = usedEdges.filter(([a, b]) => comp.has(a) && comp.has(b))

    if (hasCycle(comp, adj)) {
      const root = [...comp].sort()[0]
      hierarchies.push({ root, tree: {}, edges: compEdges, has_cycle: true })
    } else {
      const root = roots[0]
      const tree = makeTree(root, adj)
      const depth = getDepth(root, adj)
      hierarchies.push({ root, tree, edges: compEdges, depth })
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
