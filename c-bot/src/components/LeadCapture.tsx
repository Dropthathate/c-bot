import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

export default function LeadCapture() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (honeypot) {
      setStatus("error");
      setMessage("Invalid submission detected.");
      return;
    }

    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setStatus("idle");

    try {
      // Insert into leads table
      const { error } = await supabase.from("leads").insert([
        {
          email: email.toLowerCase().trim(),
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          setStatus("success");
          setMessage("You're already on our list! Check your email for updates.");
        } else {
          throw error;
        }
      } else {
        setStatus("success");
        setMessage("Thanks! Check your email for early access updates.");
        setEmail("");
      }
    } catch (err) {
      console.error("Lead capture error:", err);
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Get Early Access</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Join our beta community and be among the first to experience SomaSync AI.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="bg-background/50"
            />
          </div>

          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Submitting..." : "Get Early Access"}
          </Button>

          {status === "success" && (
            <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{message}</p>
            </div>
          )}
        </form>

        <p className="text-xs text-muted-foreground text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </Card>
  );
}
