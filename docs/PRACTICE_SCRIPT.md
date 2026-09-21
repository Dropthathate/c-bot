# SomaSyncAI Practice Script

Use this script with **synthetic information only**. Do not enter a real client name, date of birth, address, diagnosis, or other identifying or protected health information. The current beta is not authorized for PHI.

## Practice scenario

You are documenting a fictional client, **Sample Client A**, who reports synthetic left shoulder tightness after desk work. The goal is to practice the dashboard, intake flow, live signal display, and SOAP draft review without creating a real clinical record.

## 1. Open the upgraded dashboard

1. Open `https://www.somasyncai.com/dashboard` and sign in.
2. Confirm that the dashboard shows the greeting, **System ready**, the live clock, and the animated **SOMASYNC // SIGNAL MONITOR** panel.
3. Watch the signal panel for 10–15 seconds. It should animate while idle and display the offline status indicators until a session is opened.
4. Review the stats row and Quick actions. These are beta/demo values, so a dash or zero is expected.
5. Confirm that the page includes the intake-token panel, practice tip, voice-command panel, and news/practice content.

**Expected result:** The dashboard loads without an error, the idle signal moves continuously, and the navigation cards are visible.

## 2. Practice the intake link and token panel

1. Select **Copy intake link**.
2. Open the copied link in a separate tab or private test window.
3. Complete the intake using only fictional responses. Use a synthetic token such as `SS-TEST01` if the form permits a manual test token.
4. Return to the practitioner dashboard and place the synthetic token in **Load intake**.
5. Select **Open** and confirm that the clinical workspace opens.

**Expected result:** The intake route opens and the practitioner workspace is reachable. Do not use a real client or real clinical details for this exercise.

## 3. Practice the live workspace

1. Open **Open workspace** or go to `https://www.somasyncai.com/clinical-workspace/`.
2. Allow microphone access only if you are comfortable testing audio in the browser.
3. Select a test microphone and confirm that the input meter responds.
4. Read the disclosure aloud as practice: “This is a synthetic training session. No client-identifying information is being recorded.”
5. Begin a short session.
6. Use the hands-free commands one at a time:
   - “begin session”
   - “noting”
   - “pause”
   - “replay”
   - “time check”
   - “end session”
7. Stop the session after approximately 30–60 seconds.

**Expected result:** The live signal/microphone display responds, session state changes are visible, and the transcript area receives only the synthetic practice content.

## 4. Practice SOAP creation

Use this synthetic transcript if you need a text-only test:

> Sample Client A reports fictional left shoulder tightness after prolonged desk work. Synthetic report only. No real patient information. Therapist observed mild guarded shoulder elevation during the fictional movement check. No diagnosis is being made. Plan is to review posture, use comfortable non-diagnostic manual therapy techniques, and reassess the fictional report next session.

1. Open **SOAP generator** from Quick actions, or go to `https://www.somasyncai.com/dashboard/soap`.
2. Paste the synthetic transcript or dictate it using the browser microphone.
3. Select **Create** or **Generate Documentation**.
4. Wait for the status to change from processing to a completed draft.
5. Read all four sections: **Subjective, Objective, Assessment, and Plan**.
6. Confirm that the output is treated as a draft requiring licensed clinician review.
7. Do not export or copy the draft into a real chart during this test.

**Expected result:** An authenticated session produces a structured SOAP draft. If the request fails, capture the exact error text and the page URL, but do not include any client-identifying information.

## 5. Practice the review gate

1. Verify that the note is clearly labeled as an AI-generated draft.
2. Check whether export/print remains unavailable until the clinician-review control is selected.
3. Do not mark a note clinically reviewed unless this is a controlled synthetic test.
4. Close the test tab and clear the synthetic transcript.

## Troubleshooting checklist

- Refresh the page after deployment and sign in again.
- Use `/dashboard`, not `/dashboard/`; the trailing-slash route may return 404.
- Confirm that the browser is using the current site bundle and that the API health endpoint returns `{"status":"ok"}`.
- If the SOAP request says the beta service is unavailable, hard-refresh the page and retry. The production site now has a fallback to `https://api.somasyncai.com/api/v1`.
- If the API returns an authentication error, sign in again; SOAP creation requires an authenticated session.
- If the microphone does not respond, check browser microphone permission and select the active input device again.
- Use only synthetic content until the product’s privacy, security, vendor, and clinical-readiness requirements are complete.

## Success criteria

The practice run is successful when the dashboard animation is visible, the workspace opens, the microphone or text-only SOAP flow works with synthetic content, a structured draft appears, and the clinician-review boundary remains intact.

> **Safety boundary:** This practice script validates the interface and workflow. It does not establish HIPAA authorization, clinical validity, vendor compliance, or permission to use real client information.
