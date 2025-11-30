import DashboardLayout from "@/components/layout/DashboardLayout";
import ChatInterface from "@/components/chat/ChatInterface";

const PatientChat = () => {
  return (
    <DashboardLayout requiredRole="patient">
      <div className="h-screen flex flex-col">
        <div className="border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">AI Symptom Guide</h1>
          <p className="text-sm text-muted-foreground">
            Describe your symptoms for evidence-based guidance
          </p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface 
            placeholder="Describe what you're experiencing... (e.g., 'I have pain in my lower back that shoots down my leg')"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientChat;