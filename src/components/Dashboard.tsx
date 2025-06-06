
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import DashboardForm from './DashboardForm';
import TasksList from './TasksList';
import { LogOut, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<string[]>([]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTasksGenerated = (newTasks: string[]) => {
    setTasks(newTasks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      {/* Header */}
      <header className="bg-card border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Meeting Assistant</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">AI-powered task generation</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">{user?.displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-destructive/20 text-destructive hover:bg-destructive/5"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.displayName?.split(' ')[0]}!
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transform your meeting transcripts into actionable tasks with AI. 
              Simply paste your transcript below and let our system generate a structured task list for you.
            </p>
          </div>

          {/* Dashboard Form */}
          <DashboardForm onTasksGenerated={handleTasksGenerated} />

          {/* Tasks List */}
          <TasksList tasks={tasks} />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border/50 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Powered by Firebase, Zapier, and OpenAI</p>
            <p className="mt-1">Ready for real-time transcription integration</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
