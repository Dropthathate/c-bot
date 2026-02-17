public class AaliyahResponse 
{
    public string EarWhisper { get; set; }  // What you hear in your ear
    public string DashboardAlert { get; set; } // What flashes on the screen
    public string SoapCategory { get; set; } // Where it goes in the final note
}

public AaliyahResponse ProcessLiveAudio(string text)
{
    text = text.ToLower();

    // ANOMALY: Verbal Peace vs. Physical Guarding
    if ((text.Contains("fine") || text.Contains("no stress")) && (text.Contains("knot") || text.Contains("trigger point"))) {
        return new AaliyahResponse {
            EarWhisper = "Anomaly: Physical guarding detected. Check for hidden stressors.",
            DashboardAlert = "ANOMALY: Subjective/Objective Mismatch",
            SoapCategory = "Assessment"
        };
        // Add this to your existing analyzeSessionLive logic
if (transcript.includes("used the technique") || transcript.includes("not as painful") || transcript.includes("slept better")) {
    return {
        type: 'Success',
        message: "Clinical Progress Identified: Patient showing improved somatic awareness.",
        action: "Log as 'Treatment Success' for insurance outcome tracking."
    };
}
    }

    // SUCCESS STORY: Integrated Coping
    if (text.Contains("breathed through") || text.Contains("felt better")) {
        return new AaliyahResponse {
            EarWhisper = "Success Marker. Reinforce this behavior.",
            DashboardAlert = "SUCCESS: Somatic Regulation Achieved",
            SoapCategory = "Plan/Assessment"
        };
    }

    // NMT SPECIFIC: Muscle Referral
    if (text.Contains("headache") || text.Contains("temple pain")) {
        return new AaliyahResponse {
            EarWhisper = "Check SCM and Upper Traps for referral patterns.",
            DashboardAlert = "NMT Hint: Active Trigger Point Likely",
            SoapCategory = "Objective"
        };
    }

    return null;
}