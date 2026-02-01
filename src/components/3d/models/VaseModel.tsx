"use client";

import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

interface VaseModelProps {
  color: string;
  roughness?: number;
  metalness?: number;
}

export function VaseModel({
  color,
  roughness = 0.7,
  metalness = 0,
}: VaseModelProps) {
  const vaseRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (vaseRef.current) {
      vaseRef.current.rotation.y = state.clock.getElapsedTime() * 0.12;
    }
  });

  return (
    <mesh ref={vaseRef} castShadow>
      <cylinderGeometry args={[0.6, 0.4, 2.5, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}
