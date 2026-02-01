"use client";

import { useRef } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

interface SculptureModelProps {
  color: string;
  roughness?: number;
  metalness?: number;
}

export function SculptureModel({
  color,
  roughness = 0.4,
  metalness = 0.3,
}: SculptureModelProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      groupRef.current.rotation.z =
        Math.sin(state.clock.getElapsedTime() * 0.05) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central vertical cylinder */}
      <mesh castShadow>
        <cylinderGeometry args={[0.25, 0.25, 2, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Intersecting cube rotated */}
      <mesh rotation={[0.4, 0.5, 0.3]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness * 0.8}
          metalness={metalness * 1.1}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      {/* Ring around middle */}
      <mesh position={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.9, 0.12, 16, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness * 0.6}
          metalness={metalness}
        />
      </mesh>

      {/* Side extending arm */}
      <mesh position={[1, 0.3, 0]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[1.2, 0.2, 0.2]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Opposite arm */}
      <mesh position={[-1, -0.3, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[1.2, 0.2, 0.2]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
    </group>
  );
}
