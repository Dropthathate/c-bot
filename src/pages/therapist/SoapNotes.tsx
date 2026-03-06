import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ChatInterface from "@/components/chat/ChatInterface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Calendar, User, Loader2, Trash2 } from "lucide-react";
import { z } from "zod";

interface SoapNote {
  id: string;
  client_name: string;
  session_date: string;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  created_at: string;
}

const clientNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Client name is required" })
  .max(255, { message: "Client name must be 255 characters or less" });

const SoapNotes = () => {
  const [notes, setNotes] = useState<SoapNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const [selectedNote, setSelectedNote] = useState<SoapNote | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("soap_notes")
        .select("*")
        .eq("therapist_id", user?.id) // 🔒 CRITICAL FIX: Filter by therapist
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewNote = async () => {
    const result = clientNameSchema.safeParse(clientName);

    if (!result.success) {
      const message = result.error.issues[0]?.message ??
        "Please enter a valid client name (max 255 characters).";

      toast({
        title: "Invalid client name",
        description: message,
        variant: "destructive",
      });
      return;
    }

    const normalizedName = result.data;

    try {
      const { data, error } = await supabase
        .from("soap_notes")
        .insert({
          therapist_id: user?.id,
          client_name: normalizedName,
          session_date: new Date().toISOString().split("T")[0],
        })
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => [data, ...prev]);
      setSelectedNote(data);
      setClientName("");
      toast({
        title: "Note created",
        description: `SOAP note for ${data.client_name} has been created.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create note",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note? This cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("soap_notes")
        .delete()
        .eq("id", noteId)
        .eq("therapist_id", user?.id); // Security: ensure they own the note

      if (error) throw error;

      setNotes(prev => prev.filter(n => n.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }

      toast({
        title: "Note deleted",
        description: "The SOAP note has been permanently deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const handleSoapGenerated = (soapData: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }) => {
    // Update the selected note with the generated SOAP data
    if (selectedNote) {
      setSelectedNote({
        ...selectedNote,
        ...soapData
      });

      // Update in the notes list
      setNotes(prev => prev.map(note => 
        note.id === selectedNote.id 
          ? { ...note, ...soapData }
          : note
      ));
    }
  };

  return (
   <DashboardLayout>
      <div className="h-screen flex">
        {/* Sidebar - Note List */}
        <div className="w-80 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">SOAP Notes</h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="clientName">New Client Note</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createNewNote()}
                  placeholder="Client name..."
                />
              </div>
              <Button onClick={createNewNote} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Note
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : notes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  No notes yet. Create your first one!
                </p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className={`relative group rounded-lg transition-colors ${
                      selectedNote?.id === note.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-accent"
                    }`}
                  >
                    <button
                      onClick={() => setSelectedNote(note)}
                      className="w-full text-left p-3"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4" />
                        <span className="font-medium truncate">{note.client_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs opacity-80">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(note.session_date).toLocaleDateString()}</span>
                      </div>
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 rounded"
                      title="Delete note"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedNote ? (
            <>
              <div className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-semibold text-foreground">
                      {selectedNote.client_name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Session: {new Date(selectedNote.session_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>

              {/* SOAP Display or Chat Interface */}
              {selectedNote.subjective || selectedNote.objective || selectedNote.assessment || selectedNote.plan ? (
                <ScrollArea className="flex-1 p-4">
                  <div className="grid grid-cols-2 gap-4 max-w-4xl">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-soma-blue">Subjective</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {selectedNote.subjective || "Not documented"}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-soma-green">Objective</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {selectedNote.objective || "Not documented"}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-soma-purple">Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {selectedNote.assessment || "Not documented"}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-soma-orange">Plan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {selectedNote.plan || "Not documented"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedNote({ ...selectedNote, subjective: null, objective: null, assessment: null, plan: null })}
                    >
                      Edit / Regenerate Note
                    </Button>
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex-1 overflow-hidden">
                  <ChatInterface
                    mode="soap"
                    placeholder="Dictate your clinical observations... (e.g., 'Patient presents with right shoulder pain, limited ROM in flexion...')"
                    soapNoteId={selectedNote.id}
                    onSoapGenerated={handleSoapGenerated}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Note Selected</h3>
                <p className="text-muted-foreground">
                  Create a new note or select an existing one to begin documentation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SoapNotes;