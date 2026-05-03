export interface Vec3 { x: number; y: number; z: number }

export interface AIShot {
  shot_type: string;
  camera_angle: string;
  movement: string;
  duration: number;
  target: string;
  start_position: Vec3;
  end_position: Vec3;
  lighting: string;
  mood: string;
  description: string;
}

export interface AIScenePlan {
  scene: string;
  mood: string;
  shots: AIShot[];
  suggestions: string[];
  score: { overall: number; composition: number; lighting: number };
}
