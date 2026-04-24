import { processBfhl } from "@/lib/bfhl"

export async function GET() {
  return Response.json({ operation_code: 1 })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.data || !Array.isArray(body.data)) {
      return Response.json(
        { error: "data field must be an array" },
        { status: 400 }
      )
    }

    const result = processBfhl(body.data)
    return Response.json(result)
  } catch {
    return Response.json(
      { error: "invalid json" },
      { status: 400 }
    )
  }
}
