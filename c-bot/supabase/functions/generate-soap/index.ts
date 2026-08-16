// File: supabase/functions/generate-soap/index.ts
// REFACTORED: Uses Chat Completions API (Assistants API deprecated)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SOAP_SYSTEM_PROMPT = `You are a clinical documentation specialist for massage therapists and neuromuscular therapists. Your role is to convert raw session notes into properly formatted SOAP notes.

SOAP FORMAT:
- Subjective: Client-reported symptoms, pain quality/quantity/location, history, ADL impact
- Objective: Therapist-observed findings — ROM, posture, palpation, special tests
- Assessment: Clinical interpretation, differential diagnoses, prognosis
- Plan: Specific techniques, regions, duration, frequency, home care, referral if indicated

RULES:
1. Never invent findings not documented
2. Use anatomical precision (not "back pain" but "bilateral thoracic paraspinal hypertonicity T4-T8")
3. Include relevant ICD-10 codes if clinically indicated
4. Flag any scope-of-practice concerns clearly
5. Respond ONLY with valid JSON in this exact format:
{
  "subjective": "...",
  "objective": "...",
  "assessment": "...",
  "plan": "...",
  "icd10_codes": ["M54.5", "..."],
  "warnings": ["..."]
}`

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { rawNotes, conversationHistory } = await req.json()

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    if (!rawNotes || rawNotes.trim().length === 0) {
      throw new Error('No raw notes provided')
    }

    // Build conversation history for context
    let conversationContext = ''
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = 'Previous conversation:\n' + 
        conversationHistory.map((m: any) => `${m.role}: ${m.content}`).join('\n') + 
        '\n\n'
    }

    const userMessage = `${conversationContext}Convert these raw session notes into a SOAP note in JSON format:\n\n${rawNotes}`

    // Call Chat Completions API directly
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        temperature: 0.1, // Low temp for consistency
        max_tokens: 2000,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: SOAP_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const contentText = data.choices?.[0]?.message?.content

    if (!contentText) {
      throw new Error('No response content from OpenAI')
    }

    // Parse JSON response
    let soapData
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = contentText.match(/```json\n([\s\S]*?)\n```/) || 
                       contentText.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0]
        soapData = JSON.parse(jsonStr)
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse SOAP JSON:', contentText)
      // Fallback: return the raw response
      soapData = {
        subjective: contentText,
        objective: 'Error parsing AI response',
        assessment: 'Please review and edit manually',
        plan: 'N/A',
        icd10_codes: [],
        warnings: ['Failed to parse structured SOAP note - raw AI output returned']
      }
    }

    // Build response message
    let responseMessage = '✅ SOAP note generated successfully!'
    
    if (soapData.warnings && soapData.warnings.length > 0) {
      responseMessage += '\n\n⚠️ **Scope Warnings:**\n' + 
        soapData.warnings.map((w: string) => `• ${w}`).join('\n')
    }

    if (soapData.icd10_codes && soapData.icd10_codes.length > 0) {
      responseMessage += '\n\n📋 **ICD-10 Codes:**\n' + 
        soapData.icd10_codes.map((code: string) => `• ${code}`).join('\n')
    }

    responseMessage += '\n\nThe note has been saved. Review the SOAP sections above.'

    return new Response(
      JSON.stringify({
        soap: {
          subjective: soapData.subjective || '',
          objective: soapData.objective || '',
          assessment: soapData.assessment || '',
          plan: soapData.plan || '',
        },
        icd10_codes: soapData.icd10_codes || [],
        warnings: soapData.warnings || [],
        response: responseMessage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in generate-soap function:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        response: 'I encountered an error generating the SOAP note. Please try again or contact support.'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
