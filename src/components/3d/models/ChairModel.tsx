"use client";

import * as THREE from "three";

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
  // Create slightly darker shade for frame
  const frameColor = new THREE.Color(color).multiplyScalar(0.7);

  return (
    <group
      scale={0.75}
      rotation={[0, Math.PI * 0.2, 0]}
      position={[0, -0.3, 0]}
    >
      {/* ===== SEAT ===== */}
      {/* Main Seat Cushion - Rounded box effect with beveled edges */}
      <mesh position={[0, 0.5, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.22, 1.5]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Seat Cushion Top Bevel */}
      <mesh position={[0, 0.62, 0.05]} castShadow>
        <boxGeometry args={[1.5, 0.04, 1.4]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* ===== BACKREST ===== */}
      {/* Backrest Cushion */}
      <mesh position={[0, 1.35, -0.68]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.5, 0.16]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* ===== FRAME - BACK LEGS (extend to top) ===== */}
      {/* Back Left Leg */}
      <mesh position={[-0.72, 0.7, -0.72]} castShadow>
        <boxGeometry args={[0.1, 2.8, 0.1]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.7}
          metalness={metalness + 0.1}
        />
      </mesh>

      {/* Back Right Leg */}
      <mesh position={[0.72, 0.7, -0.72]} castShadow>
        <boxGeometry args={[0.1, 2.8, 0.1]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.7}
          metalness={metalness + 0.1}
        />
      </mesh>

      {/* ===== FRAME - FRONT LEGS ===== */}
      {/* Front Left Leg */}
      <mesh position={[-0.68, -0.15, 0.62]} castShadow>
        <boxGeometry args={[0.1, 1.1, 0.1]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.7}
          metalness={metalness + 0.1}
        />
      </mesh>

      {/* Front Right Leg */}
      <mesh position={[0.68, -0.15, 0.62]} castShadow>
        <boxGeometry args={[0.1, 1.1, 0.1]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.7}
          metalness={metalness + 0.1}
        />
      </mesh>

      {/* ===== SEAT FRAME ===== */}
      {/* Front Rail */}
      <mesh position={[0, 0.35, 0.72]} castShadow>
        <boxGeometry args={[1.5, 0.12, 0.1]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.7}
          metalness={metalness + 0.1}
        />
      </mesh>

      {/* Back Rail */}
      <mesh position={[0, 0.35, -0.62]} castShadow>
        <boxGeometry args={[1.5, 0.12, 0.1]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.7}
          metalness={metalness + 0.1}
        />
      </mesh>

      {/* Left Rail */}
      <mesh position={[-0.72, 0.35, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.12, 1.25]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.7}
          metalness={metalness + 0.1}
        />
      </mesh>

      {/* Right Rail */}
      <mesh position={[0.72, 0.35, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.12, 1.25]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.7}
          metalness={metalness + 0.1}
        />
      </mesh>

      {/* ===== BACKREST FRAME ===== */}
      {/* ===== ARMRESTS ===== */}
      {/* Left Armrest Support */}
      <mesh position={[-0.82, 0.95, 0.15]} castShadow>
        <boxGeometry args={[0.08, 0.9, 0.08]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.7}
          metalness={metalness + 0.1}
        />
      </mesh>

      {/* Right Armrest Support */}
      <mesh position={[0.82, 0.95, 0.15]} castShadow>
        <boxGeometry args={[0.08, 0.9, 0.08]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.7}
          metalness={metalness + 0.1}
        />
      </mesh>

      {/* Left Armrest Pad */}
      <mesh position={[-0.82, 1.45, -0.15]} castShadow>
        <boxGeometry args={[0.18, 0.1, 0.9]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Right Armrest Pad */}
      <mesh position={[0.82, 1.45, -0.15]} castShadow>
        <boxGeometry args={[0.18, 0.1, 0.9]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* ===== LEG CROSS BRACES ===== */}
      {/* Front Cross Brace */}
      <mesh position={[0, -0.45, 0.62]} castShadow>
        <boxGeometry args={[1.26, 0.06, 0.06]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.7}
          metalness={metalness + 0.1}
        />
      </mesh>

      {/* Back Cross Brace */}
      <mesh position={[0, -0.45, -0.72]} castShadow>
        <boxGeometry args={[1.34, 0.06, 0.06]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.7}
          metalness={metalness + 0.1}
        />
      </mesh>

      {/* Left Side Brace */}
      <mesh position={[-0.68, -0.45, -0.05]} castShadow>
        <boxGeometry args={[0.06, 0.06, 1.24]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.7}
          metalness={metalness + 0.1}
        />
      </mesh>

      {/* Right Side Brace */}
      <mesh position={[0.68, -0.45, -0.05]} castShadow>
        <boxGeometry args={[0.06, 0.06, 1.24]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.7}
          metalness={metalness + 0.1}
        />
      </mesh>

      {/* ===== DECORATIVE DETAILS ===== */}
      {/* Left Back Leg Cap */}
      <mesh position={[-0.72, 2.15, -0.72]} castShadow>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.5}
          metalness={metalness + 0.2}
        />
      </mesh>

      {/* Right Back Leg Cap */}
      <mesh position={[0.72, 2.15, -0.72]} castShadow>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={roughness * 0.5}
          metalness={metalness + 0.2}
        />
      </mesh>
    </group>
  );
}
