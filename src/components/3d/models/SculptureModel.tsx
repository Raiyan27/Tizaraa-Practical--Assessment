'use client';

import { useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';

interface SculptureModelProps {
  color: string;
  roughness?: number;
  metalness?: number;
}

export function SculptureModel({ color, roughness = 0.4, metalness = 0.3 }: SculptureModelProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central sphere */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>

      {/* Orbiting cubes */}
      <mesh position={[1.5, 0.5, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>

      <mesh position={[-1.5, -0.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>

      {/* Torus ring around */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, Math.PI / 4]} castShadow>
        <torusGeometry args={[1.2, 0.15, 16, 32]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>

      {/* Small cylinders */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>

      <mesh position={[0, -1.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>
    </group>
  );
}
