import { NextResponse } from "next/server"

const defaultBackendUrl = "https://health-prediction-1rcn.onrender.com"

const cleanBase = (value: string) => value.replace(/\/+$/, "")
const normalizeBase = (value: string) =>
  value.endsWith("/api/predict") || value.endsWith("/api/predict/")
    ? value.replace(/\/api\/predict\/?$/, "")
    : value

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const configured = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
    const bases = [configured, defaultBackendUrl]
      .filter((value): value is string => Boolean(value))
      .map((value) => cleanBase(normalizeBase(value)))
      .filter((value, index, arr) => arr.indexOf(value) === index)

    let lastError: unknown = null

    for (const base of bases) {
      const target = `${base}/api/predict/`
      try {
        const upstream = await fetch(target, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          cache: "no-store",
        })

        const raw = await upstream.text()
        let data: unknown = raw
        try {
          data = raw ? JSON.parse(raw) : {}
        } catch {
          data = { error: raw || "Upstream API returned non-JSON response" }
        }

        if (upstream.ok) {
          return NextResponse.json(data, { status: 200 })
        }

        lastError = {
          target,
          upstreamStatus: upstream.status,
          details: data,
        }
      } catch (error) {
        lastError = {
          target,
          message: error instanceof Error ? error.message : String(error),
        }
      }
    }

    return NextResponse.json(
      {
        error: "Prediction API request failed",
        attempts: bases.map((base) => `${base}/api/predict/`),
        details: lastError,
      },
      { status: 502 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
