"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Product, SelectedVariants } from "@/types/product";
import { getVariantById } from "@/data/products";

// Static model components - no animation
function ChairModelStatic({
  color,
  roughness,
  metalness,
}: {
  color: string;
  roughness: number;
  metalness: number;
}) {
  return (
    <group scale={0.6}>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0, 0.55, -0.35]}>
        <boxGeometry args={[0.8, 0.7, 0.1]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {[
        [-0.3, -0.25, -0.3],
        [0.3, -0.25, -0.3],
        [-0.3, -0.25, 0.3],
        [0.3, -0.25, 0.3],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.08, 0.5, 0.08]} />
          <meshStandardMaterial
            color={color}
            roughness={roughness}
            metalness={metalness}
          />
        </mesh>
      ))}
    </group>
  );
}

function LampModelStatic({
  color,
  roughness,
  metalness,
}: {
  color: string;
  roughness: number;
  metalness: number;
}) {
  return (
    <group scale={0.5}>
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.08, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <coneGeometry args={[0.35, 0.4, 32, 1, true]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          side={2}
        />
      </mesh>
    </group>
  );
}

function VaseModelStatic({
  color,
  roughness,
  metalness,
}: {
  color: string;
  roughness: number;
  metalness: number;
}) {
  return (
    <group scale={0.6}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.8, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
    </group>
  );
}

function RingModelStatic({
  color,
  roughness,
  metalness,
}: {
  color: string;
  roughness: number;
  metalness: number;
}) {
  return (
    <group scale={0.8} rotation={[Math.PI / 4, 0, 0]}>
      <mesh>
        <torusGeometry args={[0.35, 0.08, 32, 64]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
    </group>
  );
}

function SculptureModelStatic({
  color,
  roughness,
  metalness,
}: {
  color: string;
  roughness: number;
  metalness: number;
}) {
  return (
    <group scale={0.4}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
    </group>
  );
}

interface StaticProductPreviewProps {
  product: Product;
  selectedVariants: SelectedVariants;
  size?: number;
}

export function StaticProductPreview({
  product,
  selectedVariants,
  size = 96,
}: StaticProductPreviewProps) {
  const colorVariant = getVariantById(
    product,
    "colors",
    selectedVariants.color,
  );

  const color = colorVariant?.hex || "#888888";

  // Material properties
  const materialProps: Record<
    string,
    { roughness: number; metalness: number }
  > = {
    matte: { roughness: 0.9, metalness: 0.1 },
    glossy: { roughness: 0.2, metalness: 0.3 },
    metallic: { roughness: 0.3, metalness: 0.9 },
    wood: { roughness: 0.8, metalness: 0.0 },
    fabric: { roughness: 1.0, metalness: 0.0 },
    leather: { roughness: 0.6, metalness: 0.1 },
    ceramic: { roughness: 0.4, metalness: 0.2 },
    glass: { roughness: 0.1, metalness: 0.1 },
    gold: { roughness: 0.2, metalness: 1.0 },
    silver: { roughness: 0.2, metalness: 1.0 },
    "rose-gold": { roughness: 0.2, metalness: 1.0 },
    platinum: { roughness: 0.15, metalness: 1.0 },
    bronze: { roughness: 0.4, metalness: 0.8 },
    marble: { roughness: 0.3, metalness: 0.1 },
    concrete: { roughness: 0.9, metalness: 0.0 },
    resin: { roughness: 0.2, metalness: 0.2 },
  };

  const { roughness, metalness } = materialProps[selectedVariants.material] || {
    roughness: 0.5,
    metalness: 0.3,
  };

  const renderModel = () => {
    const props = { color, roughness, metalness };

    switch (product.geometryType) {
      case "box":
        return <ChairModelStatic {...props} />;
      case "cylinder":
        return <LampModelStatic {...props} />;
      case "lathe":
        return <VaseModelStatic {...props} />;
      case "torus":
        return <RingModelStatic {...props} />;
      case "combined":
        return <SculptureModelStatic {...props} />;
      default:
        return <ChairModelStatic {...props} />;
    }
  };

  return (
    <div
      className="rounded-lg overflow-hidden bg-linear-to-br from-gray-100 to-gray-200"
      style={{ width: size, height: size }}
    >
      <Canvas
        camera={{ position: [2, 1.5, 2], fov: 35 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        frameloop="demand"
        style={{ width: size, height: size }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          {renderModel()}
          <Environment preset="city" environmentIntensity={0.3} />
        </Suspense>
      </Canvas>
    </div>
  );
}
