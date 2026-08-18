import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Receive multipart form data — audio blob + optional language
    const formData = await req.formData();
    const audioBlob = formData.get('audio') as File | null;
    const language = (formData.get('language') as string) || 'en';
    const prompt = (formData.get('prompt') as string) ||
      // Clinical prompt seeds Whisper with domain vocabulary so it transcribes correctly
      'Neuromuscular therapy session. Terms include: SOAP note, ICD-10, CPT code, ' +
      'hypertonicity, trigger point, suboccipitals, levator scapulae, trapezius, ' +
      'SCM, sternocleidomastoid, thoracic outlet, piriformis, iliopsoas, quadratus lumborum, ' +
      'Upper Crossed Syndrome, Lower Crossed Syndrome, biopsychosocial, ' +
      'myofascial release, NMT, lumbago, sciatica, cervicalgia, radiculopathy, ' +
      'contraindication, DVT, acute inflammation, range of motion, palpation, ' +
      'paraspinals, bilateral, unilateral, referred pain, ischemic compression.';

    if (!audioBlob) {
      return new Response(
        JSON.stringify({ error: 'No audio file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Forward to Whisper API
    const whisperForm = new FormData();
    whisperForm.append('file', audioBlob, 'audio.webm');
    whisperForm.append('model', 'whisper-1');
    whisperForm.append('language', language);
    whisperForm.append('prompt', prompt);
    whisperForm.append('response_format', 'verbose_json'); // gives us word timestamps too

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: whisperForm,
    });

    if (!whisperRes.ok) {
      const err = await whisperRes.text();
      console.error('Whisper error:', err);
      return new Response(
        JSON.stringify({ error: `Whisper API error: ${whisperRes.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await whisperRes.json();

    return new Response(
      JSON.stringify({
        transcript: result.text,
        language: result.language,
        duration: result.duration,
        segments: result.segments ?? [],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Transcribe function error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
