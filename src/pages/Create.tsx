import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CommandInputBox } from '@/components/cinematography/CommandInputBox';
import { HistoryList } from '@/components/cinematography/HistoryList';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { useStore } from '@/store/useStore';
import { sampleCommands } from '@/lib/mockProcessor';
import { Sparkles, Lightbulb, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Create() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { executeCommand, isLoading, commandHistory, clearHistory } = useStore();
  const [initialCommand, setInitialCommand] = useState('');
  
  useEffect(() => {
    const cmd = searchParams.get('command');
    if (cmd) {
      setInitialCommand(cmd);
    }
  }, [searchParams]);
  
  const handleSubmit = async (command: string) => {
    try {
      const shotPlan = await executeCommand(command);
      navigate(`/shot-plan/${shotPlan.id}`);
    } catch (error) {
      console.error('Failed to process command:', error);
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Wand2 className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">Command Center</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Create Shot Plan</h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Describe your scene using natural language. Include details about camera angle, lens, lighting, mood, and movement.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Input Area */}
              <div className="lg:col-span-2 space-y-6">
                <CommandInputBox
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  placeholder={initialCommand || "Describe your scene... (e.g., 'exterior rainy street, 35mm lens, low angle, noir mood')"}
                />
                
                {/* Loading state */}
                {isLoading && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                      <span>Processing your command...</span>
                    </div>
                    <CardSkeleton />
                  </div>
                )}
                
                {/* Tips */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                    <h3 className="font-semibold">Tips for Better Results</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Specify the scene type: <span className="text-foreground font-mono">interior</span> or <span className="text-foreground font-mono">exterior</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Include lens focal length: <span className="text-foreground font-mono">35mm</span>, <span className="text-foreground font-mono">50mm</span>, <span className="text-foreground font-mono">85mm</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Describe camera angle: <span className="text-foreground font-mono">low angle</span>, <span className="text-foreground font-mono">high angle</span>, <span className="text-foreground font-mono">dutch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Add movement: <span className="text-foreground font-mono">dolly</span>, <span className="text-foreground font-mono">push in</span>, <span className="text-foreground font-mono">steadicam</span>, <span className="text-foreground font-mono">handheld</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Set the mood: <span className="text-foreground font-mono">dramatic</span>, <span className="text-foreground font-mono">noir</span>, <span className="text-foreground font-mono">romantic</span>, <span className="text-foreground font-mono">tense</span>
                    </li>
                  </ul>
                </div>
                
                {/* Sample Commands */}
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4">Sample Commands</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {sampleCommands.slice(0, 4).map((cmd, i) => (
                      <Button
                        key={i}
                        variant="ghost"
                        className="justify-start h-auto py-3 px-4 font-mono text-sm text-left whitespace-normal"
                        onClick={() => handleSubmit(cmd)}
                        disabled={isLoading}
                      >
                        <Sparkles className="h-3 w-3 mr-2 text-primary flex-shrink-0" />
                        {cmd}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Sidebar - History */}
              <div className="lg:col-span-1">
                <div className="glass-card p-4 sticky top-20">
                  <HistoryList
                    history={commandHistory}
                    onClear={clearHistory}
                    maxItems={10}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
