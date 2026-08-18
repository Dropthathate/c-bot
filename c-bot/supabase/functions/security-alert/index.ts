import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const NTFY_CHANNEL = "SomasyncAI-81190";

serve(async (req) => {
  try {
    const payload = await req.json();
    const { type, table, record } = payload;

    let message = "";
    let title = "";
    let priority = "default";

    if (table === "beta_signatures") {
      title = "🆕 New Beta Signup";
      message = `Email: ${record.email || "unknown"}\nTime: ${new Date().toLocaleString()}`;
      priority = "default";
    } else if (table === "profiles") {
      title = "👤 New User Profile";
      message = `User created\nTime: ${new Date().toLocaleString()}`;
      priority = "default";
    } else {
      title = "⚠️ Database Event";
      message = `Table: ${table}\nType: ${type}\nTime: ${new Date().toLocaleString()}`;
      priority = "high";
    }

    await fetch(`https://ntfy.sh/${NTFY_CHANNEL}`, {
      method: "POST",
      headers: {
        "Title": title,
        "Priority": priority,
        "Tags": "bell",
        "Content-Type": "text/plain",
      },
      body: message,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});