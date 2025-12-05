import { Layout } from '@/components/layout/Layout';
import { RecommendationCard } from '@/components/cinematography/RecommendationCard';
import { useStore } from '@/store/useStore';
import { Recommendation } from '@/types/cinematography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Lightbulb, Camera, Sun, 
  Move, Aperture, Film, Plus
} from 'lucide-react';

// Mock recommendations when no shot plans exist
const defaultRecommendations: Recommendation[] = [
  {
    id: '1',
    type: 'angle',
    title: 'Classic Low Angle Hero Shot',
    description: 'Position the camera below eye level pointing upward to make your subject appear powerful and dominant.',
    benefit: 'Creates visual authority and dramatic impact',
    icon: 'ArrowDown',
  },
  {
    id: '2',
    type: 'movement',
    title: 'Dolly Push-In for Emotion',
    description: 'A slow forward dolly movement during dialogue creates intimacy and draws viewers into the emotional moment.',
    benefit: 'Enhances emotional engagement subconsciously',
    icon: 'MoveRight',
  },
  {
    id: '3',
    type: 'lighting',
    title: 'Rembrandt Lighting Setup',
    description: 'Position key light 45° to the side and above, creating a triangle of light on the shadowed cheek.',
    benefit: 'Classic, flattering portrait lighting',
    icon: 'Sun',
  },
  {
    id: '4',
    type: 'lens',
    title: '85mm Portrait Compression',
    description: 'Use an 85mm lens for close-ups to flatten facial features and create pleasing background separation.',
    benefit: 'Professional portrait aesthetics',
    icon: 'Aperture',
  },
  {
    id: '5',
    type: 'movement',
    title: 'Drone Reveal Shot',
    description: 'Start close on subject, then pull back and rise to reveal the entire location and context.',
    benefit: 'Dramatic establishing shot with scale',
    icon: 'Plane',
  },
  {
    id: '6',
    type: 'style',
    title: 'Film Noir Lighting',
    description: 'High contrast with deep shadows, venetian blind patterns, and single hard light sources.',
    benefit: 'Creates mystery and tension',
    icon: 'Lightbulb',
  },
  {
    id: '7',
    type: 'angle',
    title: 'Dutch Angle for Unease',
    description: 'Tilt the camera 15-30° to create visual disorientation and psychological tension.',
    benefit: 'Conveys instability and unease',
    icon: 'RotateCcw',
  },
  {
    id: '8',
    type: 'lighting',
    title: 'Golden Hour Magic',
    description: 'Shoot during the hour after sunrise or before sunset for warm, directional, flattering light.',
    benefit: 'Natural cinematic beauty',
    icon: 'Sun',
  },
  {
    id: '9',
    type: 'movement',
    title: 'Steadicam One-Take',
    description: 'Follow your subject through a location in one continuous take for immersive storytelling.',
    benefit: 'Creates fluid, immersive experience',
    icon: 'MoveRight',
  },
];

const categoryInfo = {
  angle: { icon: Camera, label: 'Camera Angles', color: 'text-blue-400' },
  movement: { icon: Move, label: 'Camera Movement', color: 'text-purple-400' },
  lighting: { icon: Sun, label: 'Lighting Techniques', color: 'text-amber-400' },
  lens: { icon: Aperture, label: 'Lens Selection', color: 'text-emerald-400' },
  style: { icon: Film, label: 'Visual Styles', color: 'text-pink-400' },
};

export default function Recommendations() {
  const { shotPlans, addNotification } = useStore();
  
  // Group recommendations by type
  const groupedRecommendations = defaultRecommendations.reduce((acc, rec) => {
    if (!acc[rec.type]) acc[rec.type] = [];
    acc[rec.type].push(rec);
    return acc;
  }, {} as Record<string, Recommendation[]>);
  
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Smart Shot Suggestions</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Professional cinematography techniques and alternatives to enhance your shot plans. Click any suggestion to learn more.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {Object.entries(categoryInfo).map(([key, info]) => {
              const Icon = info.icon;
              const count = groupedRecommendations[key]?.length || 0;
              return (
                <div key={key} className="glass-card p-4 text-center">
                  <Icon className={`h-6 w-6 ${info.color} mx-auto mb-2`} />
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{info.label}</p>
                </div>
              );
            })}
          </div>
          
          {/* Recommendations by Category */}
          {Object.entries(groupedRecommendations).map(([type, recommendations]) => {
            const info = categoryInfo[type as keyof typeof categoryInfo];
            const Icon = info?.icon || Lightbulb;
            
            return (
              <section key={type} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-lg bg-secondary ${info?.color || 'text-muted-foreground'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold">{info?.label || type}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map(rec => (
                    <RecommendationCard
                      key={rec.id}
                      recommendation={rec}
                      onApply={() => addNotification(`Noted: ${rec.title}`, 'info')}
                    />
                  ))}
                </div>
              </section>
            );
          })}
          
          {/* CTA */}
          <div className="glass-card p-8 text-center mt-12">
            <Lightbulb className="h-10 w-10 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Get Personalized Suggestions</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create a shot plan to receive AI recommendations tailored to your specific scene.
            </p>
            <Link to="/create">
              <Button variant="amber">
                <Plus className="h-4 w-4 mr-2" />
                Create Shot Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
