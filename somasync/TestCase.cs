public class TestCase
{
    public string PatientId { get; set; }
    public string CaseName { get; set; }
    public string TranscriptInput { get; set; }
    public SOAPOutput ExpectedOutput { get; set; }
}

public class SOAPOutput
{
    public string Subjective { get; set; }
    public string Objective { get; set; }
    public string Assessment { get; set; }
    public string Plan { get; set; }
}