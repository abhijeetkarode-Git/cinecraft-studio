import { CameraPath } from '@/types/simulation';
import { ShotPlan } from '@/types/cinematography';

// Speed mappings in units per second
const speedMap = {
  slow: 0.5,
  medium: 1.0,
  fast: 2.0,
};

// Generate camera path based on shot plan command
export function generateCameraPath(shotPlan: ShotPlan): CameraPath {
  const command = shotPlan.command.toLowerCase();
  const movement = shotPlan.camera.movement.toLowerCase();
  
  // Determine movement type
  let movementType: CameraPath['movementType'] = 'dolly';
  if (command.includes('orbit') || movement.includes('orbit')) {
    movementType = 'orbit';
  } else if (command.includes('crane') || movement.includes('crane')) {
    movementType = 'crane';
  } else if (command.includes('track') || movement.includes('track') || movement.includes('follow')) {
    movementType = 'tracking';
  } else if (command.includes('dolly') || movement.includes('dolly') || movement.includes('push') || movement.includes('pull')) {
    movementType = 'dolly';
  }
  
  // Determine speed
  let speed: CameraPath['speed'] = 'medium';
  if (command.includes('slow') || command.includes('gentle')) {
    speed = 'slow';
  } else if (command.includes('fast') || command.includes('quick') || command.includes('rapid')) {
    speed = 'fast';
  }
  
  // Determine direction
  let direction = 'forward';
  if (command.includes('backward') || command.includes('pull out') || command.includes('pull back')) {
    direction = 'backward';
  } else if (command.includes('left')) {
    direction = 'left';
  } else if (command.includes('right')) {
    direction = 'right';
  } else if (command.includes('up') || command.includes('rise')) {
    direction = 'up';
  } else if (command.includes('down') || command.includes('descend')) {
    direction = 'down';
  }
  
  // Generate path based on movement type
  const pathData = generatePathPoints(movementType, direction, speed);
  
  return {
    shotPlanId: shotPlan.id,
    movementType,
    speed,
    direction,
    radius: movementType === 'orbit' ? 5 : undefined,
    startPosition: pathData.start,
    endPosition: pathData.end,
    pathPoints: pathData.points,
    duration: parseFloat(shotPlan.duration.replace(/[^0-9.]/g, '')) || 5,
  };
}

function generatePathPoints(
  movementType: CameraPath['movementType'],
  direction: string,
  speed: CameraPath['speed']
): { start: { x: number; y: number; z: number }; end: { x: number; y: number; z: number }; points: { x: number; y: number; z: number }[] } {
  const numPoints = 20;
  const points: { x: number; y: number; z: number }[] = [];
  
  switch (movementType) {
    case 'dolly': {
      const startZ = direction === 'backward' ? 3 : 8;
      const endZ = direction === 'backward' ? 8 : 3;
      const start = { x: 0, y: 1.5, z: startZ };
      const end = { x: 0, y: 1.5, z: endZ };
      
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        points.push({
          x: start.x + (end.x - start.x) * t,
          y: start.y + (end.y - start.y) * t,
          z: start.z + (end.z - start.z) * t,
        });
      }
      return { start, end, points };
    }
    
    case 'tracking': {
      const startX = direction === 'left' ? 5 : direction === 'right' ? -5 : 0;
      const endX = direction === 'left' ? -5 : direction === 'right' ? 5 : 0;
      const start = { x: startX, y: 1.5, z: 5 };
      const end = { x: endX, y: 1.5, z: 5 };
      
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        points.push({
          x: start.x + (end.x - start.x) * t,
          y: start.y,
          z: start.z + Math.sin(t * Math.PI) * 0.5, // Slight curve
        });
      }
      return { start, end, points };
    }
    
    case 'orbit': {
      const radius = 5;
      const startAngle = direction === 'left' ? 0 : Math.PI;
      const endAngle = direction === 'left' ? Math.PI : 0;
      const start = { x: Math.cos(startAngle) * radius, y: 2, z: Math.sin(startAngle) * radius };
      const end = { x: Math.cos(endAngle) * radius, y: 2, z: Math.sin(endAngle) * radius };
      
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const angle = startAngle + (endAngle - startAngle) * t;
        points.push({
          x: Math.cos(angle) * radius,
          y: 2,
          z: Math.sin(angle) * radius,
        });
      }
      return { start, end, points };
    }
    
    case 'crane': {
      const startY = direction === 'down' ? 6 : 1;
      const endY = direction === 'down' ? 1 : 6;
      const start = { x: 0, y: startY, z: 5 };
      const end = { x: 0, y: endY, z: 4 };
      
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        // Smooth easing curve
        const eased = t * t * (3 - 2 * t);
        points.push({
          x: 0,
          y: start.y + (end.y - start.y) * eased,
          z: start.z + (end.z - start.z) * eased,
        });
      }
      return { start, end, points };
    }
    
    default:
      return {
        start: { x: 0, y: 1.5, z: 5 },
        end: { x: 0, y: 1.5, z: 5 },
        points: [{ x: 0, y: 1.5, z: 5 }],
      };
  }
}

// Get position at a given progress (0-1)
export function getPositionAtProgress(path: CameraPath, progress: number): { x: number; y: number; z: number } {
  const points = path.pathPoints;
  if (points.length === 0) return path.startPosition;
  if (points.length === 1) return points[0];
  
  const index = Math.floor(progress * (points.length - 1));
  const nextIndex = Math.min(index + 1, points.length - 1);
  const localProgress = (progress * (points.length - 1)) - index;
  
  return {
    x: points[index].x + (points[nextIndex].x - points[index].x) * localProgress,
    y: points[index].y + (points[nextIndex].y - points[index].y) * localProgress,
    z: points[index].z + (points[nextIndex].z - points[index].z) * localProgress,
  };
}

// Get look-at direction based on movement type
export function getLookAtTarget(path: CameraPath): { x: number; y: number; z: number } {
  // Always look at the subject (center of scene)
  return { x: 0, y: 1, z: 0 };
}
