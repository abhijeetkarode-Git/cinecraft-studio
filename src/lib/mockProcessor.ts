import { ShotPlan, Recommendation, TeamMember, Comment, Version } from '@/types/cinematography';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Keywords for parsing
const angleKeywords = {
  'low angle': 'low',
  'low': 'low',
  'high angle': 'high',
  'high': 'high',
  'bird eye': 'bird-eye',
  'aerial': 'bird-eye',
  'dutch': 'dutch',
  'tilted': 'dutch',
  'eye level': 'eye-level',
} as const;

const movementKeywords = [
  'dolly', 'push in', 'pull out', 'track', 'pan', 'tilt', 'crane',
  'steadicam', 'handheld', 'static', 'follow', 'orbit', 'zoom'
];

const framingKeywords = {
  'extreme close': 'extreme-close-up',
  'close up': 'close-up',
  'closeup': 'close-up',
  'medium close': 'medium-close',
  'medium': 'medium',
  'medium wide': 'medium-wide',
  'wide': 'wide',
  'extreme wide': 'extreme-wide',
  'establishing': 'extreme-wide',
};

const moodKeywords = [
  'dramatic', 'tense', 'romantic', 'melancholic', 'joyful', 'mysterious',
  'ethereal', 'gritty', 'noir', 'hopeful', 'ominous', 'serene', 'chaotic'
];

const lightingStyles = [
  'natural', 'low-key', 'high-key', 'chiaroscuro', 'silhouette',
  'rembrandt', 'split', 'butterfly', 'practical', 'motivated'
];

const cinematicStyles = [
  'Film Noir', 'Neo-Noir', 'Naturalistic', 'Expressionist', 'Minimalist',
  'Baroque', 'Documentary', 'Music Video', 'Commercial', 'Anamorphic Widescreen'
];

export function processCommand(command: string): ShotPlan {
  const lowerCommand = command.toLowerCase();
  
  // Detect scene type
  const isExterior = lowerCommand.includes('exterior') || lowerCommand.includes('outdoor') || lowerCommand.includes('outside');
  const sceneType = isExterior ? 'exterior' : 'interior';
  
  // Detect weather
  const weatherMatch = lowerCommand.match(/\b(rainy|rain|sunny|cloudy|foggy|snowy|stormy|overcast|clear)\b/);
  const weather = weatherMatch ? weatherMatch[1] : undefined;
  
  // Detect time of day
  const timeMatch = lowerCommand.match(/\b(dawn|morning|day|afternoon|dusk|sunset|golden hour|night|midnight|evening)\b/);
  const timeOfDay = timeMatch ? timeMatch[1] : 'day';
  
  // Detect angle
  let angle: ShotPlan['camera']['angle'] = 'eye-level';
  for (const [keyword, value] of Object.entries(angleKeywords)) {
    if (lowerCommand.includes(keyword)) {
      angle = value as ShotPlan['camera']['angle'];
      break;
    }
  }
  
  // Detect framing
  let framing: ShotPlan['camera']['framing'] = 'medium';
  for (const [keyword, value] of Object.entries(framingKeywords)) {
    if (lowerCommand.includes(keyword)) {
      framing = value as ShotPlan['camera']['framing'];
      break;
    }
  }
  
  // Detect lens
  const lensMatch = lowerCommand.match(/(\d+)mm/);
  const focalLength = lensMatch ? `${lensMatch[1]}mm` : '50mm';
  const focalNum = lensMatch ? parseInt(lensMatch[1]) : 50;
  const lensType = focalNum < 35 ? 'Wide Angle' : focalNum > 85 ? 'Telephoto' : 'Standard Prime';
  
  // Detect movement
  let movement = 'Static';
  for (const mov of movementKeywords) {
    if (lowerCommand.includes(mov)) {
      movement = mov.charAt(0).toUpperCase() + mov.slice(1);
      if (mov === 'follow') movement = 'Follow/Tracking';
      if (mov === 'push in') movement = 'Dolly Push-In';
      if (mov === 'pull out') movement = 'Dolly Pull-Out';
      break;
    }
  }
  
  // Detect mood
  let mood = 'Dramatic';
  for (const m of moodKeywords) {
    if (lowerCommand.includes(m)) {
      mood = m.charAt(0).toUpperCase() + m.slice(1);
      break;
    }
  }
  
  // Generate location from command
  const locationPatterns = [
    /(?:in|at|on)\s+(?:a|the|an)?\s*([a-z\s]+?)(?:\s+scene|\s+shot|,|\.|$)/i,
    /([a-z]+\s+street|[a-z]+\s+room|[a-z]+\s+alley|[a-z]+\s+building)/i,
  ];
  
  let location = isExterior ? 'Urban Street' : 'Interior Space';
  for (const pattern of locationPatterns) {
    const match = command.match(pattern);
    if (match) {
      location = match[1].trim();
      break;
    }
  }
  
  // Generate lighting based on mood and scene
  const lightingStyle = lowerCommand.includes('noir') ? 'Low-Key Noir' :
    lowerCommand.includes('natural') ? 'Natural/Available' :
    mood === 'Dramatic' ? 'Chiaroscuro' :
    mood === 'Romantic' ? 'Soft High-Key' :
    'Three-Point Lighting';
  
  // Generate color palette based on mood
  const colorPalettes: Record<string, string[]> = {
    Dramatic: ['#1a1a2e', '#16213e', '#0f3460', '#e94560'],
    Romantic: ['#f8b4b4', '#a855f7', '#ec4899', '#fce7f3'],
    Mysterious: ['#0d1b2a', '#1b263b', '#415a77', '#778da9'],
    Noir: ['#000000', '#1a1a1a', '#333333', '#c9a227'],
    Serene: ['#a8dadc', '#457b9d', '#1d3557', '#f1faee'],
  };
  
  const colorPalette = colorPalettes[mood] || colorPalettes['Dramatic'];
  
  // Generate cinematic style
  const cinematicStyle = lowerCommand.includes('noir') ? 'Film Noir' :
    lowerCommand.includes('documentary') ? 'Documentary Style' :
    focalNum > 50 ? 'Anamorphic Widescreen' :
    'Naturalistic Cinema';
  
  // Generate shot type description
  const shotType = `${framing.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} ${angle === 'eye-level' ? '' : angle.replace(/-/g, ' ') + ' angle '}${movement !== 'Static' ? movement + ' ' : ''}Shot`;
  
  // Generate tags
  const tags: string[] = [];
  if (lowerCommand.includes('action')) tags.push('action');
  if (lowerCommand.includes('dialogue') || lowerCommand.includes('conversation')) tags.push('dialogue');
  if (framing === 'extreme-wide' || framing === 'wide') tags.push('establishing');
  if (mood.toLowerCase() === 'dramatic') tags.push('dramatic');
  if (mood.toLowerCase() === 'romantic') tags.push('romantic');
  if (lowerCommand.includes('suspense') || lowerCommand.includes('tension')) tags.push('suspense');
  
  return {
    id: generateId(),
    command,
    createdAt: new Date(),
    sceneType,
    location: location.charAt(0).toUpperCase() + location.slice(1),
    timeOfDay: timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1),
    weather: weather ? weather.charAt(0).toUpperCase() + weather.slice(1) : undefined,
    camera: {
      position: `Camera positioned ${angle === 'low' ? 'below subject level' : angle === 'high' ? 'above subject level' : 'at subject eye level'}`,
      angle,
      lens: lensType,
      focalLength,
      aperture: focalNum < 35 ? 'f/2.8' : focalNum > 85 ? 'f/1.4' : 'f/2.0',
      framing,
      movement,
      stabilization: movement === 'Handheld' ? 'Handheld (intentional shake)' : movement === 'Steadicam' ? 'Steadicam' : 'Tripod/Dolly',
    },
    lighting: {
      style: lightingStyle,
      keyLight: isExterior ? 'Sun/Available Light' : 'ARRI SkyPanel',
      fillLight: 'Bounce/Negative Fill',
      backLight: mood === 'Dramatic' ? 'Rim/Edge Light' : undefined,
      practicals: isExterior ? undefined : ['Window light', 'Practical lamps'],
      colorTemperature: timeOfDay === 'Golden Hour' || timeOfDay === 'Sunset' ? '3200K (Warm)' : '5600K (Daylight)',
      contrast: mood === 'Dramatic' || mood === 'Noir' ? 'high' : mood === 'Romantic' ? 'low' : 'medium',
    },
    mood,
    cinematicStyle,
    colorPalette,
    references: [
      `${cinematicStyle} films`,
      `${mood} sequences from acclaimed cinematographers`,
      `Roger Deakins' ${isExterior ? 'exterior' : 'interior'} work`,
    ],
    shotType: shotType.trim(),
    duration: movement === 'Static' ? '3-5 seconds' : '8-12 seconds',
    description: `A ${framing.replace(/-/g, ' ')} shot from a ${angle.replace(/-/g, ' ')} angle, capturing the scene with a ${focalLength} ${lensType.toLowerCase()} lens. ${movement !== 'Static' ? `The camera executes a ${movement.toLowerCase()} movement. ` : ''}The lighting creates a ${lightingStyle.toLowerCase()} atmosphere, emphasizing the ${mood.toLowerCase()} tone of the scene.`,
    tags: tags.length > 0 ? tags : ['dramatic'],
  };
}

export function generateRecommendations(shotPlan: ShotPlan): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Alternate angle suggestion
  if (shotPlan.camera.angle === 'eye-level') {
    recommendations.push({
      id: generateId(),
      type: 'angle',
      title: 'Try a Low Angle',
      description: 'A low angle would add more visual power and make the subject appear more dominant.',
      benefit: 'Increases dramatic tension and visual interest',
      icon: 'ArrowDown',
      relatedShotPlanId: shotPlan.id,
    });
  }
  
  // Movement suggestion
  if (shotPlan.camera.movement === 'Static') {
    recommendations.push({
      id: generateId(),
      type: 'movement',
      title: 'Add Dolly Movement',
      description: 'A subtle push-in could enhance emotional engagement with the subject.',
      benefit: 'Creates subconscious emotional pull',
      icon: 'MoveRight',
      relatedShotPlanId: shotPlan.id,
    });
  }
  
  // Reverse shot
  recommendations.push({
    id: generateId(),
    type: 'angle',
    title: 'Reverse Shot Coverage',
    description: 'Consider a complementary reverse angle for dialogue coverage or reaction shots.',
    benefit: 'Complete scene coverage for editing flexibility',
    icon: 'RotateCcw',
    relatedShotPlanId: shotPlan.id,
  });
  
  // Drone alternative
  if (shotPlan.sceneType === 'exterior') {
    recommendations.push({
      id: generateId(),
      type: 'movement',
      title: 'Drone Establishing Shot',
      description: 'An aerial perspective could provide context and scale for this exterior scene.',
      benefit: 'Establishes geography and adds production value',
      icon: 'Plane',
      relatedShotPlanId: shotPlan.id,
    });
  }
  
  // Lighting alternative
  recommendations.push({
    id: generateId(),
    type: 'lighting',
    title: shotPlan.lighting.contrast === 'high' ? 'Softer Fill Light' : 'Higher Contrast Ratio',
    description: shotPlan.lighting.contrast === 'high' 
      ? 'Adding more fill could reveal details while maintaining mood.'
      : 'Reducing fill light would create more dramatic shadows.',
    benefit: 'Alternative visual interpretation of the scene',
    icon: 'Sun',
    relatedShotPlanId: shotPlan.id,
  });
  
  // Lens suggestion
  const currentFocal = parseInt(shotPlan.camera.focalLength);
  recommendations.push({
    id: generateId(),
    type: 'lens',
    title: currentFocal < 50 ? 'Longer Lens Compression' : 'Wider Lens Perspective',
    description: currentFocal < 50 
      ? 'A longer lens would compress the background and isolate the subject more.'
      : 'A wider lens would show more environment and context.',
    benefit: 'Different spatial relationship and feel',
    icon: 'Aperture',
    relatedShotPlanId: shotPlan.id,
  });
  
  return recommendations;
}

export const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Sarah Chen', role: 'Director of Photography', avatar: '', status: 'online' },
  { id: '2', name: 'Marcus Williams', role: 'Director', avatar: '', status: 'online' },
  { id: '3', name: 'Elena Rodriguez', role: '1st AD', avatar: '', status: 'away' },
  { id: '4', name: 'James Park', role: 'Gaffer', avatar: '', status: 'offline' },
  { id: '5', name: 'Nina Patel', role: 'Camera Operator', avatar: '', status: 'online' },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: '',
    content: 'Love the low angle choice here. Should we consider a slightly longer lens to compress the background more?',
    timestamp: new Date(Date.now() - 3600000),
    shotPlanId: 'demo',
  },
  {
    id: '2',
    userId: '2',
    userName: 'Marcus Williams',
    userAvatar: '',
    content: 'Great suggestion. Also thinking we might want to add some atmospheric haze for depth.',
    timestamp: new Date(Date.now() - 1800000),
    shotPlanId: 'demo',
  },
];

export const mockVersions: Version[] = [
  {
    id: '1',
    number: 'v1.0',
    createdAt: new Date(Date.now() - 86400000),
    createdBy: 'Sarah Chen',
    changes: 'Initial shot plan created',
    shotPlanId: 'demo',
  },
  {
    id: '2',
    number: 'v1.1',
    createdAt: new Date(Date.now() - 43200000),
    createdBy: 'Marcus Williams',
    changes: 'Updated camera angle to low angle',
    shotPlanId: 'demo',
  },
  {
    id: '3',
    number: 'v1.2',
    createdAt: new Date(Date.now() - 3600000),
    createdBy: 'Sarah Chen',
    changes: 'Added dolly movement, adjusted lighting',
    shotPlanId: 'demo',
  },
];

export const sampleCommands = [
  "Create exterior rainy street scene, follow actor with 35mm lens, low angle, noir mood",
  "Interior coffee shop, golden hour light through windows, medium shot, romantic atmosphere",
  "Dramatic close-up, high contrast lighting, 85mm lens, static, tense dialogue scene",
  "Wide establishing shot, desert landscape, drone aerial, dawn, epic cinematic style",
  "Handheld medium shot, documentary style, natural lighting, interior office",
  "Dutch angle close-up, neon lighting, cyberpunk mood, 24mm wide lens",
];
