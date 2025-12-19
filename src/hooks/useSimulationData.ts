import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CameraPath, SceneComposition, SceneSimulation } from '@/types/simulation';
import { ShotPlan } from '@/types/cinematography';
import { generateCameraPath } from '@/lib/cameraPathGenerator';
import { analyzeComposition } from '@/lib/compositionAnalyzer';
import { useStore } from '@/store/useStore';

export function useSimulationData(shotPlan: ShotPlan | undefined) {
  const [cameraPath, setCameraPath] = useState<CameraPath | null>(null);
  const [composition, setComposition] = useState<SceneComposition | null>(null);
  const [simulation, setSimulation] = useState<SceneSimulation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useStore();

  // Load or generate camera path
  const loadCameraPath = useCallback(async () => {
    if (!shotPlan) return;
    
    try {
      // Try to load existing
      const { data, error: fetchError } = await supabase
        .from('camera_paths')
        .select('*')
        .eq('shot_plan_id', shotPlan.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setCameraPath({
          id: data.id,
          shotPlanId: data.shot_plan_id,
          movementType: data.movement_type as CameraPath['movementType'],
          speed: data.speed as CameraPath['speed'],
          direction: data.direction,
          radius: data.radius ? Number(data.radius) : undefined,
          startPosition: data.start_position as { x: number; y: number; z: number },
          endPosition: data.end_position as { x: number; y: number; z: number },
          pathPoints: data.path_points as { x: number; y: number; z: number }[],
          duration: Number(data.duration),
        });
      } else {
        // Generate new
        const generated = generateCameraPath(shotPlan);
        setCameraPath(generated);
      }
    } catch (err) {
      console.error('Error loading camera path:', err);
    }
  }, [shotPlan]);

  // Load or generate composition
  const loadComposition = useCallback(async () => {
    if (!shotPlan) return;
    
    try {
      const { data, error: fetchError } = await supabase
        .from('scene_compositions')
        .select('*')
        .eq('shot_plan_id', shotPlan.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setComposition({
          id: data.id,
          shotPlanId: data.shot_plan_id,
          ruleOfThirdsEnabled: data.rule_of_thirds_enabled,
          leadingLinesEnabled: data.leading_lines_enabled,
          subjectPosition: data.subject_position as { x: number; y: number },
          keyLightDirection: data.key_light_direction as SceneComposition['keyLightDirection'],
          fillLightDirection: data.fill_light_direction as SceneComposition['fillLightDirection'],
          rimLightDirection: data.rim_light_direction as SceneComposition['rimLightDirection'],
          leadingLinesPoints: (data.leading_lines_points as unknown) as { x1: number; y1: number; x2: number; y2: number }[],
          suggestions: (data.suggestions as unknown) as SceneComposition['suggestions'],
        });
      } else {
        const generated = analyzeComposition(shotPlan);
        setComposition(generated);
      }
    } catch (err) {
      console.error('Error loading composition:', err);
    }
  }, [shotPlan]);

  // Load or generate simulation
  const loadSimulation = useCallback(async () => {
    if (!shotPlan) return;
    
    try {
      const { data, error: fetchError } = await supabase
        .from('scene_simulations')
        .select('*')
        .eq('shot_plan_id', shotPlan.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setSimulation({
          id: data.id,
          shotPlanId: data.shot_plan_id,
          cameraPosition: data.camera_position as { x: number; y: number; z: number },
          cameraRotation: data.camera_rotation as { x: number; y: number; z: number },
          cameraFov: Number(data.camera_fov),
          actorPosition: data.actor_position as { x: number; y: number; z: number },
          environmentType: data.environment_type as SceneSimulation['environmentType'],
          showGrid: data.show_grid,
          showFrustum: data.show_frustum,
          pathConfig: (data.path_config as unknown) as CameraPath | undefined,
        });
      } else {
        // Generate default simulation
        const envType = shotPlan.sceneType === 'exterior' 
          ? (shotPlan.location.toLowerCase().includes('street') ? 'street' : 'outdoor')
          : 'interior';
        
        setSimulation({
          shotPlanId: shotPlan.id,
          cameraPosition: { x: 0, y: 2, z: 5 },
          cameraRotation: { x: 0, y: 0, z: 0 },
          cameraFov: parseInt(shotPlan.camera.focalLength) || 50,
          actorPosition: { x: 0, y: 0, z: 0 },
          environmentType: envType,
          showGrid: true,
          showFrustum: true,
        });
      }
    } catch (err) {
      console.error('Error loading simulation:', err);
    }
  }, [shotPlan]);

  // Save camera path
  const saveCameraPath = useCallback(async (path: CameraPath) => {
    if (!shotPlan) return;
    
    setIsLoading(true);
    try {
      const { data, error: saveError } = await supabase
        .from('camera_paths')
        .upsert({
          id: path.id,
          shot_plan_id: path.shotPlanId,
          movement_type: path.movementType,
          speed: path.speed,
          direction: path.direction,
          radius: path.radius,
          start_position: path.startPosition,
          end_position: path.endPosition,
          path_points: path.pathPoints,
          duration: path.duration,
        }, { onConflict: 'shot_plan_id' })
        .select()
        .single();

      if (saveError) throw saveError;
      
      setCameraPath({ ...path, id: data.id });
      addNotification('Camera path saved', 'success');
    } catch (err) {
      console.error('Error saving camera path:', err);
      setError('Failed to save camera path');
      addNotification('Failed to save camera path', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [shotPlan, addNotification]);

  // Save composition
  const saveComposition = useCallback(async (comp: SceneComposition) => {
    if (!shotPlan) return;
    
    setIsLoading(true);
    try {
      const upsertData: Record<string, unknown> = {
        shot_plan_id: comp.shotPlanId,
        rule_of_thirds_enabled: comp.ruleOfThirdsEnabled,
        leading_lines_enabled: comp.leadingLinesEnabled,
        subject_position: comp.subjectPosition,
        key_light_direction: comp.keyLightDirection,
        fill_light_direction: comp.fillLightDirection,
        rim_light_direction: comp.rimLightDirection,
        leading_lines_points: comp.leadingLinesPoints,
        suggestions: comp.suggestions,
      };
      if (comp.id) upsertData.id = comp.id;

      const { data, error: saveError } = await supabase
        .from('scene_compositions')
        // @ts-ignore - dynamic upsert data
        .upsert(upsertData)
        .select()
        .single();

      if (saveError) throw saveError;
      
      setComposition({ ...comp, id: data.id });
      addNotification('Composition saved', 'success');
    } catch (err) {
      console.error('Error saving composition:', err);
      setError('Failed to save composition');
      addNotification('Failed to save composition', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [shotPlan, addNotification]);

  // Save simulation
  const saveSimulation = useCallback(async (sim: SceneSimulation) => {
    if (!shotPlan) return;
    
    setIsLoading(true);
    try {
      const upsertData: Record<string, unknown> = {
        shot_plan_id: sim.shotPlanId,
        camera_position: sim.cameraPosition,
        camera_rotation: sim.cameraRotation,
        camera_fov: sim.cameraFov,
        actor_position: sim.actorPosition,
        environment_type: sim.environmentType,
        show_grid: sim.showGrid,
        show_frustum: sim.showFrustum,
        path_config: sim.pathConfig,
      };
      if (sim.id) upsertData.id = sim.id;

      const { data, error: saveError } = await supabase
        .from('scene_simulations')
        // @ts-ignore - dynamic upsert data
        .upsert(upsertData)
        .select()
        .single();

      if (saveError) throw saveError;
      
      setSimulation({ ...sim, id: data.id });
      addNotification('Simulation saved', 'success');
    } catch (err) {
      console.error('Error saving simulation:', err);
      setError('Failed to save simulation');
      addNotification('Failed to save simulation', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [shotPlan, addNotification]);

  // Load all data on mount
  useEffect(() => {
    if (shotPlan) {
      setIsLoading(true);
      Promise.all([
        loadCameraPath(),
        loadComposition(),
        loadSimulation(),
      ]).finally(() => setIsLoading(false));
    }
  }, [shotPlan?.id, loadCameraPath, loadComposition, loadSimulation]);

  return {
    cameraPath,
    composition,
    simulation,
    isLoading,
    error,
    setCameraPath,
    setComposition,
    setSimulation,
    saveCameraPath,
    saveComposition,
    saveSimulation,
    regenerateCameraPath: () => {
      if (shotPlan) {
        const path = generateCameraPath(shotPlan);
        setCameraPath(path);
        return path;
      }
      return null;
    },
    regenerateComposition: () => {
      if (shotPlan) {
        const comp = analyzeComposition(shotPlan);
        setComposition(comp);
        return comp;
      }
      return null;
    },
  };
}
