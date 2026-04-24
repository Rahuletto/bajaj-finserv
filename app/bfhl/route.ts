import { processBfhl } from "@/lib/bfhl"

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: cors })
}

export async function GET() {
  return Response.json({ operation_code: 1 }, { headers: cors })
}

export async function POST(req: Request) {
  try {
    let body = await req.json()

    if (!body.data || !Array.isArray(body.data)) {
      return Response.json(
        { error: "data field must be an array" },
        { status: 400, headers: cors }
      )
    }

    let result = processBfhl(body.data)
    return Response.json(result, { headers: cors })
  } catch {
    return Response.json(
      { error: "invalid json" },
      { status: 400, headers: cors }
    )
  }
}
