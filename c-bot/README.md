🎧 SomaSync AI

# The First Live In-Ear Neuromuscular Assistant

Real-time, hands-free clinical documentation for manual/neuromuscular therapy
practitioners — powered by voice AI that lives in a Bluetooth earpiece.

## 🌟 What is This?

SomaSync AI is a voice-controlled assistant that helps bodywork practitioners:

* 🎤 **Document hands-free** while treating clients — no typing mid-session
* 🧠 **Speak naturally, log clinically** — colloquial terms ("kneecap," "calf
  muscle") are automatically corrected to proper anatomical/physiological
  terminology (patella, gastrocnemius) in the final note
* 📝 **Auto-generate structured SOAP notes** — captured in separate,
  command-triggered blocks (Subjective / Objective / Assessment / Plan), each
  reviewed and verified by the therapist before finalizing
* 🔎 **ICD-10 reference lookup** — for reference only; not a diagnosis, and
  not yet insurance/billing compliant (see Compliance Status below)

## 🎤 Voice Commands

Block-based logging — the assistant only listens and records when a command
is heard. It is not always transcribing; it's an assistant working under the
therapist's direction, not an autonomous recorder.

* **"Subjective log"** — begin recording the client's stated reason for
  visit / complaint
* **"Objective log"** — begin recording clinical observations/findings
* **"Assessment log"** — begin recording clinical assessment
* **"Plan log"** — begin recording treatment plan
* **"Leah Leah log"** — begin recording a freeform note (anything the
  therapist wants documented outside the standard SOAP structure)
* A block ends when the next command is heard, an explicit stop is spoken, or
  after a few seconds of silence

Each logged block is transcribed, rephrased into correct clinical
terminology, and shown to the therapist for review/edit before being
finalized — nothing is saved to the record without therapist verification.

## 🎧 Why In-Ear?

Traditional documentation interrupts your workflow. SomaSync AI works
through a wireless Bluetooth earpiece so:

✅ Both hands stay free for treatment
✅ Audio feedback plays only through the therapist's earpiece — clients don't
hear it
✅ Document during the session, not after
✅ No tablets or keyboards on the treatment table

Works with any Bluetooth headset with a microphone — no special "voice
command" hardware feature required. The app does its own always-on
keyword-spotting for the commands above; the headset just needs to carry
audio to and from the device.

## ⚠️ Compliance Status — read before using in a real billing context

* **ICD-10**: no licensing restriction (public domain), but codes are
  presented as *reference only*. This is not a diagnosis, and practitioners
  without diagnostic scope of practice should confirm codes with the
  client's prescribing provider before use on any claim.
* **CPT codes**: intentionally not implemented. CPT is copyrighted by the
  AMA and requires a paid distributor license to use commercially — this has
  not yet been obtained. Do not add CPT code display/generation without
  confirming licensing status first.
* **HIPAA / PHI**: the app displays an on-screen reminder not to enter
  identifying client information, but the platform itself has not undergone
  a HIPAA compliance audit. Treat all session data accordingly during beta.

## 🚀 Status

**Beta — Live**, actively iterating with real practitioners.

**Shipped:**
* Voice-command-triggered, block-based SOAP note capture (Whisper
  transcription + clinical terminology normalization)
* Reference-only ICD-10 lookup
* Therapist dashboard, session chat, analytics
* Bluetooth earpiece audio in/out

**Planned:**
* Session timing prompts + body-mechanics reminders between logging blocks
* SomaSphere — population-level pattern visualization
* SyncLearn — contextual in-session learning modules
* Technique/mobilization video library
* Team accounts (multi-practitioner practices)
* CPT code support (pending AMA distributor license)

## 🛠️ Tech Stack

* **Frontend**: React + Vite + TailwindCSS + shadcn/ui (Radix primitives)
* **Voice capture**: Web Speech API (always-on command/wake-phrase
  detection) + OpenAI Whisper (accurate transcription of each logged block,
  including in noisy office environments)
* **Clinical language processing**: OpenAI (SOAP structuring, terminology
  normalization)
* **Backend**: Supabase (auth, database, edge functions)

---

Made for bodywork practitioners worldwide.