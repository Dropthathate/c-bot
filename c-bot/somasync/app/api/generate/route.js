import { NextResponse } from "next/server";

export async function POST(req) {
  const { rawNotes } = await req.json();

  if (!rawNotes) {
    return NextResponse.json({ error: "No notes provided" }, { status: 400 });
  }

  const res = await fetch(
    `${process.env.SUPABASE_URL}/functions/v1/generate-soap`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ rawNotes }),
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `Supabase error ${res.status}` },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
