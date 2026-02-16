import DashboardLayout from "@/components/layout/DashboardLayout";
import ChatInterface from "@/components/chat/ChatInterface";

const TherapistChat = () => {
  return (
    <DashboardLayout requiredRole="therapist">
      <div className="h-screen flex flex-col">
        <div className="border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">Clinical AI Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Get clinical guidance with Somasync AI powered by ΛΛLIYΛH.IO - Trained on datasets from the NIH (National Institutes of Health), Stanford Medicine, Mayo Clinic, Johns Hopkins, and other leading clinical research institutions.
          </p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface 
            placeholder="Ask about treatment protocols, technique recommendations, or clinical reasoning..."
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TherapistChat;
