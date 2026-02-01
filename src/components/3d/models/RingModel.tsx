'use client';

import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

interface RingModelProps {
  color: string;
  roughness?: number;
  metalness?: number;
}

export function RingModel({ color, roughness = 0.2, metalness = 0.8 }: RingModelProps) {
  const ringRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <mesh ref={ringRef} castShadow>
      <torusGeometry args={[1, 0.3, 16, 32]} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}
