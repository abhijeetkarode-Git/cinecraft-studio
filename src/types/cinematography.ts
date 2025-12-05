export interface ShotPlan {
  id: string;
  command: string;
  createdAt: Date;
  
  // Scene details
  sceneType: 'interior' | 'exterior';
  location: string;
  timeOfDay: string;
  weather?: string;
  
  // Camera setup
  camera: {
    position: string;
    angle: 'low' | 'eye-level' | 'high' | 'bird-eye' | 'dutch';
    lens: string;
    focalLength: string;
    aperture: string;
    framing: 'extreme-close-up' | 'close-up' | 'medium-close' | 'medium' | 'medium-wide' | 'wide' | 'extreme-wide';
    movement: string;
    stabilization: string;
  };
  
  // Lighting
  lighting: {
    style: string;
    keyLight: string;
    fillLight: string;
    backLight?: string;
    practicals?: string[];
    colorTemperature: string;
    contrast: 'low' | 'medium' | 'high';
  };
  
  // Mood & Style
  mood: string;
  cinematicStyle: string;
  colorPalette: string[];
  references: string[];
  
  // Shot summary
  shotType: string;
  duration: string;
  description: string;
  
  // Storyboard
  storyboardUrl?: string;
  blockingDiagram?: string;
  
  // Tags
  tags: string[];
}

export interface CommandHistory {
  id: string;
  command: string;
  timestamp: Date;
  shotPlanId?: string;
}

export interface Recommendation {
  id: string;
  type: 'angle' | 'movement' | 'lighting' | 'lens' | 'style';
  title: string;
  description: string;
  benefit: string;
  icon: string;
  relatedShotPlanId?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  shotPlanId: string;
}

export interface Version {
  id: string;
  number: string;
  createdAt: Date;
  createdBy: string;
  changes: string;
  shotPlanId: string;
}

export type SceneTag = 
  | 'action' 
  | 'dialogue' 
  | 'establishing' 
  | 'transition' 
  | 'dramatic' 
  | 'romantic' 
  | 'suspense' 
  | 'comedy';

export type ExportFormat = 'pdf' | 'csv' | 'json' | 'blender' | 'unreal';
