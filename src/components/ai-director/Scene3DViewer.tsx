import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Box, Cylinder, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import type { AIShot } from "@/types/aiDirector";

function Subject() {
  return (
    <group position={[0, 0.9, 0]}>
      <Cylinder args={[0.3, 0.4, 1.4, 16]}>
        <meshStandardMaterial color="#4a5568" />
      </Cylinder>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#fcd5ce" />
      </mesh>
    </group>
  );
}

function EnvironmentRoom() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <Box args={[20, 6, 0.1]} position={[0, 3, -8]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>
      <Box args={[0.1, 6, 16]} position={[-8, 3, 0]}>
        <meshStandardMaterial color="#252525" />
      </Box>
      <Box args={[0.1, 6, 16]} position={[8, 3, 0]}>
        <meshStandardMaterial color="#252525" />
      </Box>
    </>
  );
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function CinematicCamera({
  shot,
  shotProgress,
}: {
  shot: AIShot;
  shotProgress: number;
}) {
  const cam = useRef<THREE.PerspectiveCamera>(null);
  const { set } = useThree();

  useEffect(() => {
    if (cam.current) set({ camera: cam.current });
  }, [set]);

  useFrame(() => {
    if (!cam.current) return;
    const t = easeInOut(Math.max(0, Math.min(1, shotProgress)));
    const sp = shot.start_position;
    const ep = shot.end_position;

    let x = sp.x + (ep.x - sp.x) * t;
    let y = sp.y + (ep.y - sp.y) * t;
    let z = sp.z + (ep.z - sp.z) * t;

    if (shot.movement === "orbit") {
      const radius = Math.hypot(sp.x, sp.z) || 5;
      const startAngle = Math.atan2(sp.z, sp.x);
      const angle = startAngle + t * Math.PI * 0.6;
      x = Math.cos(angle) * radius;
      z = Math.sin(angle) * radius;
      y = sp.y + (ep.y - sp.y) * t;
    }

    cam.current.position.set(x, y, z);
    cam.current.lookAt(0, 1, 0);
  });

  return <PerspectiveCamera ref={cam} makeDefault fov={50} position={[shot.start_position.x, shot.start_position.y, shot.start_position.z]} />;
}

function FreeCamera() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={55} />
      <OrbitControls enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 2} />
    </>
  );
}

interface Props {
  shot: AIShot | null;
  shotProgress: number;
  freeView: boolean;
}

export function Scene3DViewer({ shot, shotProgress, freeView }: Props) {
  const lighting = shot?.lighting?.toLowerCase() || "";
  const keyColor = useMemo(() => {
    if (lighting.includes("warm") || lighting.includes("golden") || lighting.includes("sunset")) return "#ffb070";
    if (lighting.includes("cool") || lighting.includes("blue") || lighting.includes("moon")) return "#7fb6ff";
    if (lighting.includes("neon")) return "#ff5cf0";
    return "#ffffff";
  }, [lighting]);

  return (
    <Canvas shadows className="rounded-lg">
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 4]} intensity={1.1} color={keyColor} castShadow />
        <directionalLight position={[-4, 4, -2]} intensity={0.4} color="#a0c8ff" />
        <Grid args={[30, 30]} cellSize={1} cellThickness={0.4} cellColor="#3a3a3a" sectionColor="#555" fadeDistance={40} position={[0, 0.01, 0]} />
        <EnvironmentRoom />
        <Subject />
        {shot && !freeView ? (
          <CinematicCamera shot={shot} shotProgress={shotProgress} />
        ) : (
          <FreeCamera />
        )}
      </Suspense>
    </Canvas>
  );
}
