public class SomaSyncDashboard
{
    // COLUMN 1: Capture the text
    public void ReceiveLiveText(string text)
    {
        Console.WriteLine($"[STREAM]: {text}");
        AnalyzeText(text); // Send to Column 2
    }

    // COLUMN 2: The Aaliyah.io Brain
    private void AnalyzeText(string text)
    {
        // Detecting an Anomaly (Verbal vs. Physical)
        if (text.Contains("fine") && text.Contains("trigger point"))
        {
            Console.BackgroundColor = ConsoleColor.Red;
            Console.WriteLine("![ANOMALY]: Patient says 'Fine' but NMT find is 'Trigger Point'.");
            Console.ResetColor();
            UpdateCompliance("Anomaly: Physical guarding present."); // Send to Column 3
        }
        
        // Detecting a Success Story
        if (text.Contains("improved") || text.Contains("breathed"))
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("[SUCCESS]: Somatic regulation technique worked.");
            Console.ResetColor();
        }
    }

    // COLUMN 3: Documentation & ICD-10
    private void UpdateCompliance(string finding)
    {
        Console.WriteLine($"[SOAP DRAFT]: {finding} -> Suggesting ICD-10: M79.12");
    }
}