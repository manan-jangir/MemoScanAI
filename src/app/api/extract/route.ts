import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { imageUrl, base64Image, mimeType } = await request.json()

    if (!base64Image) {
      return NextResponse.json({ error: "No image data sent" }, { status: 400 })
    }

    const schema = {
      type: "object",
      properties: {
        title: { type: "string" },
        date: { type: "string" },
        category: { type: "string", enum: ['Utility', 'Finance', 'Event', 'Medical', 'Other'] },
        summary: { type: "string" }
      },
      required: ["title", "date", "category", "summary"]
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        "Analyze this document. Extract the title, any relevant upcoming date (in YYYY-MM-DD format strictly, leave empty string if not found), the category, and a brief summary.",
        { inlineData: { data: base64Image, mimeType } }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const parsed = JSON.parse(response.text || '{}')

    let extractedDate = null
    if (parsed.date && parsed.date.trim() !== '') {
      extractedDate = parsed.date
    }

    // Insert into Supabase DB
    const { data, error } = await supabase.from('documents').insert({
      title: parsed.title || "Unknown Document",
      extracted_date: extractedDate,
      category: parsed.category || 'Other',
      excerpt: parsed.summary || "",
      image_url: imageUrl,
      user_id: user.id
    }).select().single()

    if (error) throw error

    return NextResponse.json({ success: true, data })

  } catch (err: any) {
    console.error("Extraction error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
