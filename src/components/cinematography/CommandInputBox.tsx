import { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CommandInputBoxProps {
  onSubmit: (command: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function CommandInputBox({ 
  onSubmit, 
  isLoading = false, 
  placeholder = "Describe your scene... (e.g., 'exterior rainy street, 35mm lens, low angle, noir mood')",
  className 
}: CommandInputBoxProps) {
  const [command, setCommand] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() && !isLoading) {
      onSubmit(command.trim());
      setCommand('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-warm rounded-2xl opacity-20 blur-xl group-focus-within:opacity-40 transition-opacity" />
        
        {/* Input container */}
        <div className="relative glass-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">AI Command Processor</span>
          </div>
          
          <textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className={cn(
              "w-full min-h-[120px] px-4 py-4 bg-transparent text-foreground",
              "placeholder:text-muted-foreground/50 resize-none",
              "focus:outline-none font-mono text-sm leading-relaxed",
              "disabled:opacity-50"
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e);
              }
            }}
          />
          
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/30 bg-secondary/30">
            <span className="text-xs text-muted-foreground">
              Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">⌘</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">Enter</kbd> to generate
            </span>
            
            <Button
              type="submit"
              variant="amber"
              disabled={!command.trim() || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Generate Shot Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
