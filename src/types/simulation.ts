// Camera Path Types
export interface CameraPath {
  id?: string;
  shotPlanId: string;
  movementType: 'dolly' | 'tracking' | 'orbit' | 'crane';
  speed: 'slow' | 'medium' | 'fast';
  direction: string;
  radius?: number;
  startPosition: { x: number; y: number; z: number };
  endPosition: { x: number; y: number; z: number };
  pathPoints: { x: number; y: number; z: number }[];
  duration: number;
}

// Scene Composition Types
export interface SceneComposition {
  id?: string;
  shotPlanId: string;
  ruleOfThirdsEnabled: boolean;
  leadingLinesEnabled: boolean;
  subjectPosition: { x: number; y: number };
  keyLightDirection: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'front' | 'back';
  fillLightDirection: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'front' | 'back';
  rimLightDirection?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'back';
  leadingLinesPoints: { x1: number; y1: number; x2: number; y2: number }[];
  suggestions: CompositionSuggestion[];
}

export interface CompositionSuggestion {
  type: 'rule-of-thirds' | 'leading-lines' | 'lighting' | 'framing';
  title: string;
  description: string;
  applied: boolean;
}

// Scene Simulation Types
export interface SceneSimulation {
  id?: string;
  shotPlanId: string;
  cameraPosition: { x: number; y: number; z: number };
  cameraRotation: { x: number; y: number; z: number };
  cameraFov: number;
  actorPosition: { x: number; y: number; z: number };
  environmentType: 'studio' | 'outdoor' | 'interior' | 'street';
  showGrid: boolean;
  showFrustum: boolean;
  pathConfig?: CameraPath;
}

// Animation state
export interface AnimationState {
  isPlaying: boolean;
  progress: number;
  currentPosition: { x: number; y: number; z: number };
}
