import { NextResponse } from "next/server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: Message[] = body.messages;

    console.log("Incoming messages:", messages);

    if (!process.env.MISTRAL_API_KEY || !process.env.MISTRAL_API_URL) {
      console.error("Missing API key or URL");
      return NextResponse.json({ error: "MISTRAL_API_KEY or MISTRAL_API_URL missing" }, { status: 500 });
    }

    const formattedMessages = messages.map(m => ({
      role: m.role,
      content: m.content.trim(),
    }));

    const response = await fetch(process.env.MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: formattedMessages,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Mistral API returned error:", text);
      return NextResponse.json({ error: "Mistral API error", details: text }, { status: 500 });
    }

    const data = await response.json();
    const assistantMessage = data?.choices?.[0]?.message?.content?.trim() ?? "No response";

    return NextResponse.json({ reply: assistantMessage });
  } catch (err: any) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
