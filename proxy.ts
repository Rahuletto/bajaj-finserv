import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(),
    })
  }

  const res = NextResponse.next()
  for (const [key, val] of Object.entries(corsHeaders())) {
    res.headers.set(key, val)
  }
  return res
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }
}

export const proxyConfig = {
  matcher: ["/bfhl"],
}
