import { NextResponse } from "next/server";
import { askAi } from "@/lib/ai-service";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const aiResponse = await askAi(question);
    return NextResponse.json(aiResponse);
  } catch (error: any) {
    console.error("AI Test Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
