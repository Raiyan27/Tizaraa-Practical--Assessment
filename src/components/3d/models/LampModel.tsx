'use client';

import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

interface LampModelProps {
  color: string;
  roughness?: number;
  metalness?: number;
}

export function LampModel({ color, roughness = 0.3, metalness = 0.5 }: LampModelProps) {
  const groupRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={groupRef as any}>
      {/* Base */}
      <mesh position={[0, -1, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>

      {/* Stem */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>

      {/* Lampshade */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.8, 1, 32]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>

      {/* Light bulb (sphere) */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffffcc" emissive="#ffff88" emissiveIntensity={0.5} />
      </mesh>

      {/* Point light inside */}
      <pointLight position={[0, 1, 0]} intensity={1} distance={5} color="#ffffcc" />
    </group>
  );
}
