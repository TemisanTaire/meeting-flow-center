
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface FormData {
  email: string;
  role: string;
  goal: string;
  transcript: string;
  zapierWebhook: string;
}

interface DashboardFormProps {
  onTasksGenerated: (tasks: string[]) => void;
}

const DashboardForm: React.FC<DashboardFormProps> = ({ onTasksGenerated }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    role: '',
    goal: '',
    transcript: '',
    zapierWebhook: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFormData(prev => ({
          ...prev,
          role: userData.role || '',
          goal: userData.goal || '',
          zapierWebhook: userData.zapierWebhook || ''
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        role: formData.role,
        goal: formData.goal,
        zapierWebhook: formData.zapierWebhook,
        updatedAt: new Date()
      }, { merge: true });
      
      toast({
        title: "Saved",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      console.error('Error saving user data:', error);
      toast({
        title: "Error",
        description: "Failed to save profile information.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.zapierWebhook) {
      toast({
        title: "Error",
        description: "Please enter your Zapier webhook URL.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.transcript.trim()) {
      toast({
        title: "Error",
        description: "Please enter a meeting transcript.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        email: formData.email,
        role: formData.role,
        goal: formData.goal,
        transcript: formData.transcript,
        timestamp: new Date().toISOString(),
        userId: user?.uid
      };

      console.log("Sending to Zapier:", payload);

      const response = await fetch(formData.zapierWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(payload),
      });

      // Simulate task generation since we can't read the response with no-cors
      const mockTasks = [
        "Schedule follow-up meeting with key stakeholders",
        "Create action item summary document",
        "Send meeting notes to all participants",
        "Research discussed solutions and prepare recommendations",
        "Set up project timeline based on meeting decisions"
      ];
      
      onTasksGenerated(mockTasks);

      toast({
        title: "Success",
        description: "Meeting transcript sent to Zapier! Tasks are being generated.",
      });

      setFormData(prev => ({ ...prev, transcript: '' }));
    } catch (error) {
      console.error("Error sending to Zapier:", error);
      toast({
        title: "Error",
        description: "Failed to send transcript to Zapier. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-lg border-0 bg-card">
      <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <CardTitle className="text-xl font-semibold">Meeting Analysis Dashboard</CardTitle>
        <p className="text-primary-foreground/90">Submit your meeting transcript for AI-powered task generation</p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">Your Role</Label>
              <Input
                id="role"
                type="text"
                placeholder="e.g., Product Manager, Developer, Designer"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal" className="text-sm font-medium">Project Goal</Label>
            <Input
              id="goal"
              type="text"
              placeholder="What are you trying to achieve?"
              value={formData.goal}
              onChange={(e) => handleInputChange('goal', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zapierWebhook" className="text-sm font-medium">Zapier Webhook URL</Label>
            <Input
              id="zapierWebhook"
              type="url"
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              value={formData.zapierWebhook}
              onChange={(e) => handleInputChange('zapierWebhook', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transcript" className="text-sm font-medium">Meeting Transcript</Label>
            <Textarea
              id="transcript"
              placeholder="Paste your meeting transcript here..."
              value={formData.transcript}
              onChange={(e) => handleInputChange('transcript', e.target.value)}
              rows={8}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={saveUserData}
              disabled={saving}
              variant="outline"
              className="flex-1 border-primary/20 text-primary hover:bg-primary/5"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              ) : null}
              Save Profile
            </Button>
            
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
              ) : null}
              Generate Tasks
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DashboardForm;
