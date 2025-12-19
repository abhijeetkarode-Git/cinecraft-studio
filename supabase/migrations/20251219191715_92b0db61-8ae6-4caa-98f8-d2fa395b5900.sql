-- Create camera_paths table for storing generated camera movement data
CREATE TABLE public.camera_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shot_plan_id TEXT NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('dolly', 'tracking', 'orbit', 'crane')),
  speed TEXT NOT NULL DEFAULT 'medium' CHECK (speed IN ('slow', 'medium', 'fast')),
  direction TEXT NOT NULL,
  radius NUMERIC,
  start_position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0, "z": 0}'::jsonb,
  end_position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0, "z": 0}'::jsonb,
  path_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration NUMERIC NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scene_composition table for storing composition optimization data
CREATE TABLE public.scene_compositions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shot_plan_id TEXT NOT NULL,
  rule_of_thirds_enabled BOOLEAN NOT NULL DEFAULT true,
  leading_lines_enabled BOOLEAN NOT NULL DEFAULT true,
  subject_position JSONB NOT NULL DEFAULT '{"x": 0.33, "y": 0.33}'::jsonb,
  key_light_direction TEXT NOT NULL DEFAULT 'top-left' CHECK (key_light_direction IN ('top-left', 'top-right', 'bottom-left', 'bottom-right', 'front', 'back')),
  fill_light_direction TEXT NOT NULL DEFAULT 'front' CHECK (fill_light_direction IN ('top-left', 'top-right', 'bottom-left', 'bottom-right', 'front', 'back')),
  rim_light_direction TEXT CHECK (rim_light_direction IN ('top-left', 'top-right', 'bottom-left', 'bottom-right', 'back', NULL)),
  leading_lines_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scene_simulations table for storing 3D simulation configuration
CREATE TABLE public.scene_simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shot_plan_id TEXT NOT NULL,
  camera_position JSONB NOT NULL DEFAULT '{"x": 0, "y": 2, "z": 5}'::jsonb,
  camera_rotation JSONB NOT NULL DEFAULT '{"x": 0, "y": 0, "z": 0}'::jsonb,
  camera_fov NUMERIC NOT NULL DEFAULT 50,
  actor_position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0, "z": 0}'::jsonb,
  environment_type TEXT NOT NULL DEFAULT 'studio' CHECK (environment_type IN ('studio', 'outdoor', 'interior', 'street')),
  show_grid BOOLEAN NOT NULL DEFAULT true,
  show_frustum BOOLEAN NOT NULL DEFAULT true,
  path_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.camera_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scene_compositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scene_simulations ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for public access (no auth required for this app)
CREATE POLICY "Allow all operations on camera_paths" ON public.camera_paths FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on scene_compositions" ON public.scene_compositions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on scene_simulations" ON public.scene_simulations FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for faster lookups
CREATE INDEX idx_camera_paths_shot_plan_id ON public.camera_paths(shot_plan_id);
CREATE INDEX idx_scene_compositions_shot_plan_id ON public.scene_compositions(shot_plan_id);
CREATE INDEX idx_scene_simulations_shot_plan_id ON public.scene_simulations(shot_plan_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_camera_paths_updated_at
  BEFORE UPDATE ON public.camera_paths
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scene_compositions_updated_at
  BEFORE UPDATE ON public.scene_compositions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scene_simulations_updated_at
  BEFORE UPDATE ON public.scene_simulations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();