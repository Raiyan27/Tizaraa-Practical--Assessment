"use client";

import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

interface ChairModelProps {
  color: string;
  roughness?: number;
  metalness?: number;
}

export function ChairModel({
  color,
  roughness = 0.5,
  metalness = 0.1,
}: ChairModelProps) {
  const seatRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (seatRef.current) {
      seatRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group>
      {/* Seat */}
      <mesh ref={seatRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Back */}
      <mesh position={[0, 1, -0.9]}>
        <boxGeometry args={[2, 2, 0.2]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.8, -0.75, 0.8]}>
        <boxGeometry args={[0.2, 1.5, 0.2]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0.8, -0.75, 0.8]}>
        <boxGeometry args={[0.2, 1.5, 0.2]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[-0.8, -0.75, -0.8]}>
        <boxGeometry args={[0.2, 1.5, 0.2]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0.8, -0.75, -0.8]}>
        <boxGeometry args={[0.2, 1.5, 0.2]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
    </group>
  );
}
