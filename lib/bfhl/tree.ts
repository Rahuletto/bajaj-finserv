type TreeNode = { [key: string]: TreeNode }

export function makeTree(root: string, adj: Map<string, string[]>): TreeNode {
  return { [root]: buildChildren(root, adj) }
}

function buildChildren(node: string, adj: Map<string, string[]>): TreeNode {
  const kids = adj.get(node) || []
  const obj: TreeNode = {}
  for (let k of kids) {
    obj[k] = buildChildren(k, adj)
  }
  return obj
}

export function getDepth(node: string, adj: Map<string, string[]>): number {
  const children = adj.get(node) || []
  if (children.length === 0) return 1
  let max = 0
  for (let c of children) {
    const d = getDepth(c, adj)
    if (d > max) max = d
  }
  return max + 1
}
