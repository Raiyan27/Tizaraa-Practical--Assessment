"use client";

import { Suspense, useRef, useEffect, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, useProgress } from "@react-three/drei";
import { Product, SelectedVariants } from "@/types/product";
import { getVariantById } from "@/data/products";
import { ChairModel } from "@/components/3d/models/ChairModel";
import { LampModel } from "@/components/3d/models/LampModel";
import { VaseModel } from "@/components/3d/models/VaseModel";
import { RingModel } from "@/components/3d/models/RingModel";
import { SculptureModel } from "@/components/3d/models/SculptureModel";
import { Group } from "three";
import { Spinner } from "@/components/ui/Skeleton";

// Wrapper to disable animations in the actual models
function StaticModelWrapper({ children }: { children: React.ReactElement }) {
  const groupRef = useRef<Group>(null);

  // Reset any rotation that might be applied by animations
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(0, 0, 0);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

interface StaticProductPreviewProps {
  product: Product;
  selectedVariants: SelectedVariants;
  size?: number;
}

export const StaticProductPreview = memo(function StaticProductPreview({
  product,
  selectedVariants,
  size = 96,
}: StaticProductPreviewProps) {
  const { active, progress } = useProgress();
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
        return (
          <StaticModelWrapper>
            <ChairModel {...props} />
          </StaticModelWrapper>
        );
      case "cylinder":
        return (
          <StaticModelWrapper>
            <LampModel {...props} />
          </StaticModelWrapper>
        );
      case "lathe":
        return (
          <StaticModelWrapper>
            <VaseModel {...props} />
          </StaticModelWrapper>
        );
      case "torus":
        return (
          <StaticModelWrapper>
            <RingModel {...props} />
          </StaticModelWrapper>
        );
      case "combined":
        return (
          <StaticModelWrapper>
            <SculptureModel {...props} />
          </StaticModelWrapper>
        );
      default:
        return (
          <StaticModelWrapper>
            <ChairModel {...props} />
          </StaticModelWrapper>
        );
    }
  };

  return (
    <div
      className="relative rounded-lg overflow-hiddens"
      style={{ width: size + 100, height: size + 100 }}
      role="img"
      aria-label={`3D preview of ${product.name} in ${colorVariant?.name || "selected"} color`}
    >
      <Canvas
        camera={{ position: [3.5, 1, 2], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        frameloop="demand"
        style={{ width: size + 100, height: size + 100 }}
        aria-hidden="true"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          {renderModel()}
          <Environment preset="city" environmentIntensity={0.3} />
        </Suspense>
      </Canvas>

      {/* Loading overlay */}
      {(active || progress < 100) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
});
