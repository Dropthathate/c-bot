// Define the structure for the Assistant's response
export interface ClinicalInsight {
    type: 'Anomaly' | 'Success' | 'NMT';
    message: string;
    action: string;
}

export const analyzeSessionLive = (text: string): ClinicalInsight | null => {
    const transcript = text.toLowerCase();

    // 1. ANOMALY: Verbal vs. Physical Guarding
    if (transcript.includes("fine") && (transcript.includes("knot") || transcript.includes("tight"))) {
        return {
            type: 'Anomaly',
            message: "Anomaly detected: Physical guarding contradicts verbal report.",
            action: "Probe for hidden social stressors."
        };
    }

    // 2. SUCCESS CASE: Progress Marker
    if (transcript.includes("better") || transcript.includes("managed to")) {
        return {
            type: 'Success',
            message: "Success marker identified.",
            action: "Reinforce somatic self-regulation behavior."
        };
    }

    // 3. NMT HINT: Referral Patterns
    if (transcript.includes("headache") && transcript.includes("temple")) {
        return {
            type: 'NMT',
            message: "Clinical Hint: Active referral pattern detected.",
            action: "Check SCM and Suboccipitals for trigger points."
        };
    }

    return null;
};