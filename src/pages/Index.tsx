import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ShotPlanCard } from '@/components/cinematography/ShotPlanCard';
import { HistoryList } from '@/components/cinematography/HistoryList';
import { useStore } from '@/store/useStore';
import { sampleCommands } from '@/lib/mockProcessor';
import { 
  Film, Sparkles, Camera, Lightbulb, Layers, 
  ArrowRight, Play, Zap, Target
} from 'lucide-react';

const Index = () => {
  const { shotPlans, commandHistory, deleteShotPlan } = useStore();
  const recentPlans = shotPlans.slice(0, 3);
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        {/* Animated grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Cinematography</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Turn Your Vision Into
              <span className="block text-gradient mt-2">Shot Plans</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Command-based cinematography planning. Describe your scene in natural language and get professional camera setups, lighting plans, and storyboards instantly.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <Link to="/create">
                <Button variant="amber" size="xl" className="gap-2">
                  <Play className="h-5 w-5" />
                  Create Scene
                </Button>
              </Link>
              <Link to="/library">
                <Button variant="glass" size="xl" className="gap-2">
                  View Library
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>
      
      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From initial concept to detailed shot plans, Cinecraft handles the technical planning so you can focus on creativity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Camera className="h-6 w-6" />}
              title="Smart Camera Setup"
              description="Get professional camera positions, lens choices, and framing suggestions based on your scene description."
              color="primary"
            />
            <FeatureCard
              icon={<Lightbulb className="h-6 w-6" />}
              title="Lighting Design"
              description="Automatic lighting plans with key, fill, and backlight recommendations for your desired mood."
              color="amber"
            />
            <FeatureCard
              icon={<Layers className="h-6 w-6" />}
              title="Visual Planning"
              description="Generate storyboard frames and blocking diagrams to visualize your shots before filming."
              color="accent"
            />
          </div>
        </div>
      </section>
      
      {/* Sample Commands */}
      <section className="py-16 bg-card/30 border-y border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Try These Commands</h2>
              <p className="text-muted-foreground">Click any example to get started instantly</p>
            </div>
            <Link to="/create">
              <Button variant="outline" size="sm">
                Custom Command
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sampleCommands.map((cmd, i) => (
              <Link
                key={i}
                to={`/create?command=${encodeURIComponent(cmd)}`}
                className="glass-card p-4 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Zap className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-foreground font-mono leading-relaxed">
                    {cmd}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Recent Work & History */}
      {(recentPlans.length > 0 || commandHistory.length > 0) && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Shot Plans */}
              {recentPlans.length > 0 && (
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Recent Shot Plans</h2>
                    <Link to="/library">
                      <Button variant="ghost" size="sm">
                        View All
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentPlans.map(plan => (
                      <ShotPlanCard 
                        key={plan.id} 
                        shotPlan={plan}
                        onDelete={deleteShotPlan}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* History Sidebar */}
              {commandHistory.length > 0 && (
                <div className={recentPlans.length === 0 ? 'lg:col-span-3' : ''}>
                  <div className="glass-card p-4">
                    <HistoryList 
                      history={commandHistory} 
                      maxItems={recentPlans.length > 0 ? 5 : 10}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card glow-amber p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative z-10">
              <Target className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Next Scene?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Start with a simple description and let Cinecraft generate a complete cinematography plan in seconds.
              </p>
              <Link to="/create">
                <Button variant="amber" size="lg">
                  Start Creating
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

function FeatureCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: 'primary' | 'amber' | 'accent';
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
  };
  
  return (
    <div className="glass-card p-6 group hover:border-primary/30 transition-all">
      <div className={`inline-flex p-3 rounded-xl border ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default Index;
