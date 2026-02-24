import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, X, Edit3 } from "lucide-react";

interface Note {
  id: number;
  text: string;
  color: "clay" | "sage" | "sand";
}

const initialNotes: Note[] = [
  { id: 1, text: "Review Chapter 3 of Mathematics - Trigonometry formulas", color: "clay" },
  { id: 2, text: "Science: Photosynthesis process steps to memorize", color: "sage" },
  { id: 3, text: "English essay structure: Intro, 3 body, conclusion", color: "sand" },
];

const colorMap = {
  clay: "bg-clay-light border-accent/30",
  sage: "bg-sage-light border-primary/30",
  sand: "bg-sand-dark border-border",
};

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      text: "New note — click to edit",
      color: (["clay", "sage", "sand"] as const)[notes.length % 3],
    };
    setNotes([newNote, ...notes]);
  };

  const deleteNote = (id: number) => setNotes(notes.filter((n) => n.id !== id));

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const saveEdit = () => {
    setNotes(notes.map((n) => (n.id === editingId ? { ...n, text: editText } : n)));
    setEditingId(null);
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sticky Notes</h1>
            <p className="text-brown-light">Quick notes for revision</p>
          </div>
          <Button variant="default" onClick={addNote}>
            <Plus className="w-4 h-4" /> New Note
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`rounded-xl p-5 border-2 min-h-[150px] flex flex-col transition-all duration-200 ${colorMap[note.color]}`}
            >
              {editingId === note.id ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={saveEdit}
                  autoFocus
                  className="flex-1 bg-transparent resize-none text-brown text-sm focus:outline-none"
                />
              ) : (
                <p
                  className="flex-1 text-brown text-sm cursor-pointer leading-relaxed"
                  onClick={() => startEdit(note)}
                >
                  {note.text}
                </p>
              )}
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => startEdit(note)} className="text-brown-light hover:text-brown transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => deleteNote(note.id)} className="text-brown-light hover:text-destructive transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notes;
