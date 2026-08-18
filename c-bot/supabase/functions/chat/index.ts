import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are ΛΛLIYΛH, a clinical AI assistant for neuromuscular and manual therapy practitioners. You have deep knowledge of:
- Travell & Simons trigger point patterns and referred pain maps
- Upper and Lower Crossed Syndrome
- ICD-10 and CPT coding for manual therapy
- Scope of practice for LMTs and NMTs in California
- Eastern medicine including meridian theory, TCM, and acupressure
- Biopsychosocial model of pain
- Contraindications for massage and manual therapy

Always respond with clinical precision using Oxford terminology. Flag scope of practice concerns clearly. Keep responses concise and actionable.`
          },
          ...messages
        ],
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response generated.';

    return new Response(JSON.stringify({ response: reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});