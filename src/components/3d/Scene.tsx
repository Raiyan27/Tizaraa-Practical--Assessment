"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

interface SceneProps {
  children: React.ReactNode;
}

export function Scene({ children }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 50 }}
      shadows
      className="bg-linear-to-br from-gray-50 to-gray-100"
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <spotLight position={[-5, 5, 2]} intensity={0.5} />

        {/* Environment */}
        <Environment preset="city" />

        {/* Model */}
        {children}

        {/* Ground shadow */}
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 100}
          maxPolarAngle={Math.PI / 1.5}
          minDistance={3}
          maxDistance={8}
        />
      </Suspense>
    </Canvas>
  );
}
