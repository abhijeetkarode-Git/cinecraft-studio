import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { mockTeamMembers, mockComments, mockVersions } from '@/lib/mockProcessor';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { 
  Users, MessageSquare, History, Send, 
  Circle, User, Clock, ChevronRight,
  FileText, Plus, Settings
} from 'lucide-react';

export default function Collaborate() {
  const [activeTab, setActiveTab] = useState<'team' | 'comments' | 'versions'>('team');
  const [newComment, setNewComment] = useState('');
  
  const handleSendComment = () => {
    if (newComment.trim()) {
      // In real app, this would add to state
      setNewComment('');
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Collaborate</h1>
              <p className="text-muted-foreground">
                Work together with your team on shot plans
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="amber" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Project Card */}
              <div className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Demo Project</h3>
                      <p className="text-sm text-muted-foreground">3 shot plans • Updated 2h ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Active collaborators */}
                <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                  <div className="flex -space-x-2">
                    {mockTeamMembers.slice(0, 4).map((member, i) => (
                      <div
                        key={member.id}
                        className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium"
                        style={{ zIndex: 4 - i }}
                      >
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {mockTeamMembers.filter(m => m.status === 'online').length} online
                  </span>
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="glass-card">
                <div className="p-4 border-b border-border/30">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Discussion
                  </h3>
                </div>
                
                {/* Comments List */}
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
                  {mockComments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {comment.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Comment Input */}
                <div className="p-4 border-t border-border/30">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-3 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                      onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                    />
                    <Button variant="default" size="icon" onClick={handleSendComment}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Version History */}
              <div className="glass-card">
                <div className="p-4 border-b border-border/30">
                  <h3 className="font-semibold flex items-center gap-2">
                    <History className="h-4 w-4 text-accent" />
                    Version History
                  </h3>
                </div>
                
                <div className="p-4">
                  <div className="space-y-4">
                    {mockVersions.map((version, index) => (
                      <div key={version.id} className="relative pl-6">
                        {/* Timeline line */}
                        {index !== mockVersions.length - 1 && (
                          <div className="absolute left-[7px] top-6 bottom-0 w-px bg-border" />
                        )}
                        
                        {/* Timeline dot */}
                        <div className={cn(
                          "absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2",
                          index === 0 
                            ? "bg-primary border-primary" 
                            : "bg-background border-border"
                        )} />
                        
                        <div className="pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm font-medium">{version.number}</span>
                            <span className="text-xs text-muted-foreground">
                              by {version.createdBy}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{version.changes}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar - Team Members */}
            <div className="lg:col-span-1">
              <div className="glass-card sticky top-20">
                <div className="p-4 border-b border-border/30">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Team Members
                  </h3>
                </div>
                
                <div className="p-4 space-y-3">
                  {mockTeamMembers.map(member => (
                    <div 
                      key={member.id} 
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background",
                          member.status === 'online' && "bg-green-500",
                          member.status === 'away' && "bg-amber-500",
                          member.status === 'offline' && "bg-muted"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Quick Stats */}
                <div className="p-4 border-t border-border/30">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-lg font-bold text-green-400">
                        {mockTeamMembers.filter(m => m.status === 'online').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-lg font-bold text-amber-400">
                        {mockTeamMembers.filter(m => m.status === 'away').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Away</p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-lg font-bold text-muted-foreground">
                        {mockTeamMembers.filter(m => m.status === 'offline').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Offline</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
