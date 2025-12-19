import { SceneComposition, CompositionSuggestion } from '@/types/simulation';
import { ShotPlan } from '@/types/cinematography';

// Analyze shot plan and generate composition suggestions
export function analyzeComposition(shotPlan: ShotPlan): SceneComposition {
  const suggestions: CompositionSuggestion[] = [];
  
  // Determine subject position based on framing
  const subjectPosition = getSubjectPosition(shotPlan.camera.framing, shotPlan.camera.angle);
  
  // Determine lighting directions
  const lightingDirections = determineLightingFromShotPlan(shotPlan);
  
  // Generate leading lines based on scene type
  const leadingLines = generateLeadingLines(shotPlan);
  
  // Add suggestions based on analysis
  suggestions.push(...generateSuggestions(shotPlan, subjectPosition));
  
  return {
    shotPlanId: shotPlan.id,
    ruleOfThirdsEnabled: true,
    leadingLinesEnabled: shotPlan.sceneType === 'exterior' || shotPlan.camera.framing === 'wide' || shotPlan.camera.framing === 'extreme-wide',
    subjectPosition,
    keyLightDirection: lightingDirections.key,
    fillLightDirection: lightingDirections.fill,
    rimLightDirection: lightingDirections.rim,
    leadingLinesPoints: leadingLines,
    suggestions,
  };
}

function getSubjectPosition(framing: string, angle: string): { x: number; y: number } {
  // Rule of thirds positions
  const thirds = {
    left: 0.33,
    center: 0.5,
    right: 0.67,
    top: 0.33,
    middle: 0.5,
    bottom: 0.67,
  };
  
  let x = thirds.center;
  let y = thirds.middle;
  
  // Adjust based on framing
  switch (framing) {
    case 'close-up':
    case 'extreme-close-up':
      x = thirds.center;
      y = thirds.top;
      break;
    case 'medium':
    case 'medium-close':
      x = thirds.left;
      y = thirds.middle;
      break;
    case 'wide':
    case 'medium-wide':
      x = thirds.right;
      y = thirds.bottom;
      break;
    case 'extreme-wide':
      x = thirds.center;
      y = thirds.bottom;
      break;
  }
  
  // Adjust for angle
  if (angle === 'low') {
    y = Math.min(y + 0.1, 0.8);
  } else if (angle === 'high' || angle === 'bird-eye') {
    y = Math.max(y - 0.1, 0.2);
  }
  
  return { x, y };
}

function determineLightingFromShotPlan(shotPlan: ShotPlan): {
  key: SceneComposition['keyLightDirection'];
  fill: SceneComposition['fillLightDirection'];
  rim?: SceneComposition['rimLightDirection'];
} {
  const style = shotPlan.lighting.style.toLowerCase();
  const mood = shotPlan.mood.toLowerCase();
  
  // Default three-point lighting
  let key: SceneComposition['keyLightDirection'] = 'top-left';
  let fill: SceneComposition['fillLightDirection'] = 'front';
  let rim: SceneComposition['rimLightDirection'] = 'back';
  
  // Adjust based on lighting style
  if (style.includes('rembrandt')) {
    key = 'top-right';
    fill = 'front';
    rim = 'back';
  } else if (style.includes('split')) {
    key = 'top-left';
    fill = 'bottom-right';
    rim = undefined;
  } else if (style.includes('butterfly') || style.includes('paramount')) {
    key = 'front';
    fill = 'bottom-left';
    rim = 'back';
  } else if (style.includes('silhouette')) {
    key = 'back';
    fill = 'back';
    rim = undefined;
  } else if (style.includes('low-key') || style.includes('noir')) {
    key = 'top-right';
    fill = 'bottom-left';
    rim = 'top-left';
  }
  
  // Adjust for mood
  if (mood.includes('dramatic') || mood.includes('noir')) {
    rim = 'back';
  } else if (mood.includes('romantic') || mood.includes('soft')) {
    fill = 'front';
  }
  
  return { key, fill, rim };
}

function generateLeadingLines(shotPlan: ShotPlan): { x1: number; y1: number; x2: number; y2: number }[] {
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  
  if (shotPlan.sceneType === 'exterior') {
    // Perspective lines converging to subject
    lines.push(
      { x1: 0, y1: 1, x2: 0.33, y2: 0.5 }, // Left bottom to subject
      { x1: 1, y1: 1, x2: 0.67, y2: 0.5 }, // Right bottom to subject
    );
  }
  
  if (shotPlan.camera.framing === 'wide' || shotPlan.camera.framing === 'extreme-wide') {
    // Horizon line
    lines.push({ x1: 0, y1: 0.33, x2: 1, y2: 0.33 });
  }
  
  if (shotPlan.location.toLowerCase().includes('street') || shotPlan.location.toLowerCase().includes('alley')) {
    // Street perspective
    lines.push(
      { x1: 0.1, y1: 0.8, x2: 0.5, y2: 0.4 },
      { x1: 0.9, y1: 0.8, x2: 0.5, y2: 0.4 },
    );
  }
  
  return lines;
}

function generateSuggestions(shotPlan: ShotPlan, subjectPosition: { x: number; y: number }): CompositionSuggestion[] {
  const suggestions: CompositionSuggestion[] = [];
  
  // Rule of thirds suggestion
  const isOnThirds = Math.abs(subjectPosition.x - 0.33) < 0.05 || Math.abs(subjectPosition.x - 0.67) < 0.05;
  suggestions.push({
    type: 'rule-of-thirds',
    title: 'Rule of Thirds',
    description: isOnThirds 
      ? 'Subject is well-positioned on a power point'
      : 'Consider moving subject to a thirds intersection for stronger composition',
    applied: isOnThirds,
  });
  
  // Leading lines suggestion
  if (shotPlan.sceneType === 'exterior' || shotPlan.camera.framing.includes('wide')) {
    suggestions.push({
      type: 'leading-lines',
      title: 'Leading Lines',
      description: 'Use environmental elements to guide viewer\'s eye to subject',
      applied: true,
    });
  }
  
  // Lighting suggestion based on contrast
  suggestions.push({
    type: 'lighting',
    title: 'Three-Point Lighting',
    description: `Using ${shotPlan.lighting.style} with ${shotPlan.lighting.contrast} contrast ratio`,
    applied: true,
  });
  
  // Framing suggestion
  if (shotPlan.camera.framing === 'medium' || shotPlan.camera.framing === 'medium-close') {
    suggestions.push({
      type: 'framing',
      title: 'Headroom Balance',
      description: 'Allow appropriate headroom above subject for balanced composition',
      applied: true,
    });
  }
  
  return suggestions;
}

// Get arrow direction for SVG rendering
export function getLightArrowDirection(direction: string): { startX: number; startY: number; endX: number; endY: number } {
  const positions: Record<string, { startX: number; startY: number; endX: number; endY: number }> = {
    'top-left': { startX: 15, startY: 15, endX: 40, endY: 40 },
    'top-right': { startX: 85, startY: 15, endX: 60, endY: 40 },
    'bottom-left': { startX: 15, startY: 85, endX: 40, endY: 60 },
    'bottom-right': { startX: 85, startY: 85, endX: 60, endY: 60 },
    'front': { startX: 50, startY: 10, endX: 50, endY: 40 },
    'back': { startX: 50, startY: 90, endX: 50, endY: 60 },
  };
  
  return positions[direction] || positions['front'];
}
