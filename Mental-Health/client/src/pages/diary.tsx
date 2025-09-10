import { useState, useEffect } from "react";
import { Plus, Search, Calendar, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/ui/back-button";

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: 'happy' | 'neutral' | 'sad' | 'anxious' | 'excited';
  tags: string[];
  createdAt: Date;
}

const moodEmojis = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
  anxious: '😰',
  excited: '🤩'
};

const moodColors = {
  happy: 'bg-green-100 text-green-800',
  neutral: 'bg-gray-100 text-gray-800',
  sad: 'bg-blue-100 text-blue-800',
  anxious: 'bg-orange-100 text-orange-800',
  excited: 'bg-purple-100 text-purple-800'
};

export default function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral' as DiaryEntry['mood'],
    tags: ''
  });
  const { currentUser } = useAppContext();
  const { toast } = useToast();

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem(`diary_entries_${currentUser?.id}`);
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, [currentUser?.id]);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`diary_entries_${currentUser.id}`, JSON.stringify(entries));
    }
  }, [entries, currentUser?.id]);

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    const entry: DiaryEntry = {
      id: isEditing && selectedEntry ? selectedEntry.id : Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      date: new Date().toISOString().split('T')[0],
      mood: newEntry.mood,
      tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: isEditing && selectedEntry ? selectedEntry.createdAt : new Date()
    };

    if (isEditing && selectedEntry) {
      setEntries(prev => prev.map(e => e.id === selectedEntry.id ? entry : e));
      toast({
        title: "Entry Updated",
        description: "Your diary entry has been updated successfully"
      });
    } else {
      setEntries(prev => [entry, ...prev]);
      toast({
        title: "Entry Saved",
        description: "Your diary entry has been saved successfully"
      });
    }

    resetForm();
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    setSelectedEntry(entry);
    setNewEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags.join(', ')
    });
    setIsEditing(true);
    setIsCreating(true);
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(prev => prev.filter(e => e.id !== entryId));
    toast({
      title: "Entry Deleted",
      description: "Your diary entry has been deleted"
    });
  };

  const resetForm = () => {
    setNewEntry({
      title: '',
      content: '',
      mood: 'neutral',
      tags: ''
    });
    setIsCreating(false);
    setIsEditing(false);
    setSelectedEntry(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <BackButton />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Personal Diary</h1>
          <p className="text-muted-foreground">Record your thoughts, feelings, and daily reflections</p>
        </div>
        <Dialog open={isCreating} onOpenChange={(open) => !open && resetForm()}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreating(true)} data-testid="button-new-entry">
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Entry' : 'Create New Entry'}</DialogTitle>
              <DialogDescription>
                Write down your thoughts and feelings for today
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What's on your mind today?"
                  data-testid="input-entry-title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">How are you feeling?</label>
                <div className="flex gap-2">
                  {Object.entries(moodEmojis).map(([mood, emoji]) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setNewEntry(prev => ({ ...prev, mood: mood as DiaryEntry['mood'] }))}
                      className={`p-2 rounded-lg border-2 transition-colors ${
                        newEntry.mood === mood 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      data-testid={`mood-${mood}`}
                    >
                      <span className="text-2xl">{emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write about your day, thoughts, or anything that comes to mind..."
                  className="min-h-[200px]"
                  data-testid="textarea-entry-content"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tags (comma separated)</label>
                <Input
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="work, family, health, goals"
                  data-testid="input-entry-tags"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveEntry} data-testid="button-save-entry">
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Entry' : 'Save Entry'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your entries..."
            className="pl-10"
            data-testid="input-search-entries"
          />
        </div>
      </div>

      {/* Entries Grid */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No entries found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "No entries match your search criteria" : "Start writing your first diary entry"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Entry
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{entry.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(entry.date)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{moodEmojis[entry.mood]}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {entry.content}
                </p>
                
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {entry.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {entry.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{entry.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded ${moodColors[entry.mood]}`}>
                    {entry.mood}
                  </span>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditEntry(entry)}
                      data-testid={`button-edit-${entry.id}`}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-destructive hover:text-destructive"
                      data-testid={`button-delete-${entry.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}