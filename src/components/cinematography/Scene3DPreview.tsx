import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Box, Cylinder, Cone } from '@react-three/drei';
import * as THREE from 'three';
import { CameraPath, SceneSimulation } from '@/types/simulation';
import { getPositionAtProgress, getLookAtTarget } from '@/lib/cameraPathGenerator';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Play, Pause, RotateCcw, Save, Maximize2,
  Grid3X3, Video, Box as BoxIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Scene3DPreviewProps {
  simulation: SceneSimulation;
  cameraPath?: CameraPath | null;
  onSave?: (simulation: SceneSimulation) => void;
  className?: string;
}

// Actor model component
function Actor({ position }: { position: { x: number; y: number; z: number } }) {
  return (
    <group position={[position.x, position.y + 0.9, position.z]}>
      {/* Body */}
      <Cylinder args={[0.3, 0.4, 1.4, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4a5568" />
      </Cylinder>
      {/* Head */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#fcd5ce" />
      </mesh>
      {/* Arms */}
      <Cylinder args={[0.08, 0.08, 0.6, 8]} position={[0.45, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#4a5568" />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.6, 8]} position={[-0.45, 0.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <meshStandardMaterial color="#4a5568" />
      </Cylinder>
    </group>
  );
}

// Camera frustum visualization
function CameraFrustum({ 
  position, 
  lookAt, 
  fov = 50,
  visible = true 
}: { 
  position: { x: number; y: number; z: number }; 
  lookAt: { x: number; y: number; z: number };
  fov?: number;
  visible?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (ref.current) {
      ref.current.lookAt(lookAt.x, lookAt.y, lookAt.z);
    }
  }, [lookAt]);

  if (!visible) return null;

  const depth = 2;
  const angle = (fov * Math.PI) / 360;
  const halfWidth = Math.tan(angle) * depth;
  const halfHeight = halfWidth * 0.5625; // 16:9 aspect

  return (
    <group position={[position.x, position.y, position.z]} ref={ref}>
      {/* Camera body */}
      <Box args={[0.3, 0.2, 0.4]}>
        <meshStandardMaterial color="#ef4444" />
      </Box>
      {/* Lens */}
      <Cylinder args={[0.08, 0.1, 0.2, 16]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.25]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      {/* Frustum lines */}
      <lineSegments>
        <edgesGeometry args={[new THREE.ConeGeometry(halfWidth, depth, 4)]} />
        <lineBasicMaterial color="#ef4444" transparent opacity={0.5} />
      </lineSegments>
    </group>
  );
}

// Animated camera that follows path
function AnimatedCamera({ 
  cameraPath, 
  isPlaying, 
  progress,
  onProgressUpdate
}: { 
  cameraPath: CameraPath;
  isPlaying: boolean;
  progress: number;
  onProgressUpdate: (p: number) => void;
}) {
  const lastTimeRef = useRef<number>(0);
  
  useFrame((state, delta) => {
    if (isPlaying) {
      const newProgress = progress + delta / cameraPath.duration;
      if (newProgress >= 1) {
        onProgressUpdate(1);
      } else {
        onProgressUpdate(newProgress);
      }
    }
  });

  const position = getPositionAtProgress(cameraPath, progress);
  const lookAt = getLookAtTarget(cameraPath);

  return (
    <CameraFrustum 
      position={position} 
      lookAt={lookAt}
      visible={true}
    />
  );
}

// Camera path visualization
function PathVisualization({ cameraPath }: { cameraPath: CameraPath }) {
  const points = cameraPath.pathPoints.map(p => new THREE.Vector3(p.x, p.y, p.z));
  const curve = new THREE.CatmullRomCurve3(points);
  
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(curve.getPoints(50).flatMap(p => [p.x, p.y, p.z]))}
          count={51}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#8b5cf6" linewidth={2} />
    </line>
  );
}

// Environment setup based on type
function Environment({ type }: { type: SceneSimulation['environmentType'] }) {
  const color = type === 'outdoor' ? '#87ceeb' : type === 'street' ? '#1e293b' : '#374151';
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 5, -3]} intensity={0.3} />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={type === 'outdoor' ? '#4ade80' : '#374151'} />
      </mesh>
      
      {/* Environment props based on type */}
      {type === 'interior' && (
        <>
          {/* Walls */}
          <Box args={[10, 4, 0.1]} position={[0, 2, -5]}>
            <meshStandardMaterial color="#6b7280" />
          </Box>
          <Box args={[0.1, 4, 10]} position={[-5, 2, 0]}>
            <meshStandardMaterial color="#6b7280" />
          </Box>
        </>
      )}
      
      {type === 'street' && (
        <>
          {/* Buildings */}
          <Box args={[3, 6, 3]} position={[-6, 3, -4]}>
            <meshStandardMaterial color="#374151" />
          </Box>
          <Box args={[2.5, 8, 2.5]} position={[6, 4, -3]}>
            <meshStandardMaterial color="#4b5563" />
          </Box>
        </>
      )}
    </>
  );
}

// Main 3D Scene
function Scene({ 
  simulation, 
  cameraPath, 
  isPlaying, 
  progress,
  onProgressUpdate,
  showGrid,
  showFrustum
}: {
  simulation: SceneSimulation;
  cameraPath?: CameraPath | null;
  isPlaying: boolean;
  progress: number;
  onProgressUpdate: (p: number) => void;
  showGrid: boolean;
  showFrustum: boolean;
}) {
  return (
    <>
      <Environment type={simulation.environmentType} />
      
      {showGrid && (
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#4b5563"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#6b7280"
          fadeDistance={30}
          fadeStrength={1}
          position={[0, 0.01, 0]}
        />
      )}
      
      <Actor position={simulation.actorPosition} />
      
      {cameraPath && (
        <>
          <PathVisualization cameraPath={cameraPath} />
          <AnimatedCamera 
            cameraPath={cameraPath}
            isPlaying={isPlaying}
            progress={progress}
            onProgressUpdate={onProgressUpdate}
          />
        </>
      )}
      
      {!cameraPath && showFrustum && (
        <CameraFrustum 
          position={simulation.cameraPosition}
          lookAt={simulation.actorPosition}
          fov={simulation.cameraFov}
        />
      )}
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
      />
      <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={60} />
    </>
  );
}

export function Scene3DPreview({ simulation, cameraPath, onSave, className }: Scene3DPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showGrid, setShowGrid] = useState(simulation.showGrid);
  const [showFrustum, setShowFrustum] = useState(simulation.showFrustum);

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleProgressUpdate = (p: number) => {
    if (p >= 1) {
      setIsPlaying(false);
      setProgress(1);
    } else {
      setProgress(p);
    }
  };

  return (
    <div className={cn("glass-card p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
            <BoxIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">3D Simulation</h3>
            <p className="text-xs text-muted-foreground capitalize">
              {simulation.environmentType} environment
            </p>
          </div>
        </div>
        {onSave && (
          <Button variant="ghost" size="sm" onClick={() => onSave({ ...simulation, showGrid, showFrustum })}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        )}
      </div>

      {/* 3D Canvas */}
      <div className="relative bg-background/50 rounded-lg overflow-hidden aspect-video">
        <Canvas shadows>
          <Suspense fallback={null}>
            <Scene 
              simulation={simulation}
              cameraPath={cameraPath}
              isPlaying={isPlaying}
              progress={progress}
              onProgressUpdate={handleProgressUpdate}
              showGrid={showGrid}
              showFrustum={showFrustum}
            />
          </Suspense>
        </Canvas>
        
        {/* Overlay controls */}
        <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground bg-background/80 px-2 py-1 rounded">
          Drag to rotate • Scroll to zoom
        </div>
      </div>

      {/* Playback Controls */}
      {cameraPath && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{Math.round(progress * 100)}%</span>
            <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Toggle Controls */}
      <div className="space-y-3 mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Show Grid</span>
          </div>
          <Switch
            checked={showGrid}
            onCheckedChange={setShowGrid}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-red-400" />
            <span className="text-sm">Camera Frustum</span>
          </div>
          <Switch
            checked={showFrustum}
            onCheckedChange={setShowFrustum}
          />
        </div>
      </div>
    </div>
  );
}
