// File: supabase/functions/generate-soap/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { rawNotes, conversationHistory } = await req.json()

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    const assistantId = Deno.env.get('OPENAI_ASSISTANT_ID') // Your C-Bot assistant ID
    
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }
    if (!assistantId) {
      throw new Error('OPENAI_ASSISTANT_ID not configured')
    }

    // Create a thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({}),
    })

    if (!threadResponse.ok) {
      throw new Error(`Failed to create thread: ${threadResponse.status}`)
    }

    const thread = await threadResponse.json()
    const threadId = thread.id

    // Build the user message
    let userMessage = conversationHistory && conversationHistory.length > 0
      ? `Previous conversation:\n${conversationHistory.map((m: any) => `${m.role}: ${m.content}`).join('\n')}\n\nNew raw notes to convert into SOAP format:\n${rawNotes}`
      : `Convert these raw session notes into a SOAP note:\n\n${rawNotes}\n\nRespond ONLY with a JSON object in this exact format:\n{\n  "subjective": "...",\n  "objective": "...",\n  "assessment": "...",\n  "plan": "...",\n  "warnings": ["..."]\n}`

    // Add message to thread
    await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        role: 'user',
        content: userMessage,
      }),
    })

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        assistant_id: assistantId,
      }),
    })

    if (!runResponse.ok) {
      throw new Error(`Failed to run assistant: ${runResponse.status}`)
    }

    const run = await runResponse.json()
    const runId = run.id

    // Poll for completion
    let runStatus = 'queued'
    let attempts = 0
    const maxAttempts = 30 // 30 seconds max

    while (runStatus !== 'completed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      })

      const statusData = await statusResponse.json()
      runStatus = statusData.status

      if (runStatus === 'failed' || runStatus === 'cancelled' || runStatus === 'expired') {
        throw new Error(`Assistant run ${runStatus}: ${statusData.last_error?.message || 'Unknown error'}`)
      }

      attempts++
    }

    if (runStatus !== 'completed') {
      throw new Error('Assistant timeout - took too long to respond')
    }

    // Get the assistant's messages
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
    })

    const messagesData = await messagesResponse.json()
    const assistantMessages = messagesData.data.filter((m: any) => m.role === 'assistant')
    
    if (assistantMessages.length === 0) {
      throw new Error('No response from assistant')
    }

    const assistantMessage = assistantMessages[0].content[0].text.value

    // Try to parse the JSON response
    let soapData
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = assistantMessage.match(/```json\n([\s\S]*?)\n```/) || 
                       assistantMessage.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0]
        soapData = JSON.parse(jsonStr)
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse SOAP JSON:', assistantMessage)
      // Fallback: return the raw response in subjective field
      soapData = {
        subjective: assistantMessage,
        objective: "Error parsing AI response",
        assessment: "Please review and edit manually",
        plan: "N/A",
        warnings: ["Failed to parse structured SOAP note"]
      }
    }

    // Build a user-friendly response message
    let responseMessage = "✅ SOAP note generated successfully!"
    
    if (soapData.warnings && soapData.warnings.length > 0) {
      responseMessage += "\n\n⚠️ **Scope Warnings:**\n" + soapData.warnings.map((w: string) => `• ${w}`).join('\n')
    }

    responseMessage += "\n\nThe note has been saved. Review the SOAP sections above."

    return new Response(
      JSON.stringify({
        soap: {
          subjective: soapData.subjective,
          objective: soapData.objective,
          assessment: soapData.assessment,
          plan: soapData.plan,
        },
        warnings: soapData.warnings || [],
        response: responseMessage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in generate-soap function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I apologize, but I encountered an error generating the SOAP note. Please try again or contact support if the issue persists."
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})