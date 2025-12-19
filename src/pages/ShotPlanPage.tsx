import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ShotPlanDetail } from '@/components/cinematography/ShotPlanDetail';
import { RecommendationCard } from '@/components/cinematography/RecommendationCard';
import { CameraPathVisualizer } from '@/components/cinematography/CameraPathVisualizer';
import { CompositionOverlay } from '@/components/cinematography/CompositionOverlay';
import { Scene3DPreview } from '@/components/cinematography/Scene3DPreview';
import { ShotPlanSkeleton } from '@/components/ui/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/store/useStore';
import { useSimulationData } from '@/hooks/useSimulationData';
import { generateRecommendations } from '@/lib/mockProcessor';
import { 
  ArrowLeft, Download, Share2, Trash2, 
  Sparkles, Copy, Check, Route, Grid3X3, Box
} from 'lucide-react';
import { useState } from 'react';

export default function ShotPlanPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getShotPlan, deleteShotPlan, addNotification } = useStore();
  const [copied, setCopied] = useState(false);
  
  const shotPlan = id ? getShotPlan(id) : undefined;
  const recommendations = shotPlan ? generateRecommendations(shotPlan) : [];
  
  const {
    cameraPath,
    composition,
    simulation,
    isLoading: simLoading,
    saveCameraPath,
    saveComposition,
    saveSimulation,
    setComposition,
    regenerateCameraPath,
  } = useSimulationData(shotPlan);
  
  const handleDelete = () => {
    if (id) {
      deleteShotPlan(id);
      navigate('/library');
    }
  };
  
  const handleCopyCommand = () => {
    if (shotPlan) {
      navigator.clipboard.writeText(shotPlan.command);
      setCopied(true);
      addNotification('Command copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  if (!shotPlan) {
    return (
      <Layout>
        <div className="min-h-screen py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center py-20">
              <h1 className="text-2xl font-bold mb-4">Shot Plan Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The shot plan you're looking for doesn't exist or has been deleted.
              </p>
              <Link to="/library">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Library
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <Link to="/library" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Library</span>
              </Link>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCopyCommand}
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy Command'}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Link to="/export">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            
            {/* Shot Plan Details */}
            <ShotPlanDetail shotPlan={shotPlan} />
            
            {/* AI Tools Section */}
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">AI Cinematography Tools</h2>
              </div>
              
              <Tabs defaultValue="camera-path" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="camera-path" className="flex items-center gap-2">
                    <Route className="h-4 w-4" />
                    Camera Path
                  </TabsTrigger>
                  <TabsTrigger value="composition" className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    Composition
                  </TabsTrigger>
                  <TabsTrigger value="3d-preview" className="flex items-center gap-2">
                    <Box className="h-4 w-4" />
                    3D Preview
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="camera-path">
                  {cameraPath && (
                    <CameraPathVisualizer 
                      cameraPath={cameraPath}
                      onSave={saveCameraPath}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="composition">
                  {composition && (
                    <CompositionOverlay 
                      composition={composition}
                      onUpdate={setComposition}
                      onSave={saveComposition}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="3d-preview">
                  {simulation && (
                    <Scene3DPreview 
                      simulation={simulation}
                      cameraPath={cameraPath}
                      onSave={saveSimulation}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">AI Recommendations</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.slice(0, 6).map(rec => (
                    <RecommendationCard
                      key={rec.id}
                      recommendation={rec}
                      onApply={() => addNotification(`Applied: ${rec.title}`, 'info')}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}