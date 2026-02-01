'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Product, SelectedVariants } from '@/types/product';
import { Skeleton } from '../ui/Skeleton';

// Lazy load the Scene to avoid SSR issues
const Scene = dynamic(() => import('./Scene').then(mod => ({ default: mod.Scene })), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />,
});

// Lazy load models
const ChairModel = dynamic(() => import('./models/ChairModel').then(mod => ({ default: mod.ChairModel })), { ssr: false });
const LampModel = dynamic(() => import('./models/LampModel').then(mod => ({ default: mod.LampModel })), { ssr: false });
const VaseModel = dynamic(() => import('./models/VaseModel').then(mod => ({ default: mod.VaseModel })), { ssr: false });
const RingModel = dynamic(() => import('./models/RingModel').then(mod => ({ default: mod.RingModel })), { ssr: false });
const SculptureModel = dynamic(() => import('./models/SculptureModel').then(mod => ({ default: mod.SculptureModel })), { ssr: false });

interface ProductViewerProps {
  product: Product;
  selectedVariants: SelectedVariants;
}

export function ProductViewer({ product, selectedVariants }: ProductViewerProps) {
  // Get color from selected variant
  const colorVariant = product.variants.colors.find(c => c.id === selectedVariants.color);
  const materialVariant = product.variants.materials.find(m => m.id === selectedVariants.material);
  
  const color = colorVariant?.hex || '#999999';
  
  // Material properties based on selected material
  const materialProps = {
    roughness: materialVariant?.id === 'matte' ? 0.8 :
                materialVariant?.id === 'glossy' ? 0.1 :
                materialVariant?.id === 'metallic' ? 0.2 :
                materialVariant?.id === 'wood' ? 0.7 : 0.5,
    metalness: materialVariant?.id === 'metallic' ? 0.9 :
                materialVariant?.id === 'chrome' ? 1.0 :
                materialVariant?.id === 'brushed' ? 0.7 : 0.1,
  };

  // Select model based on geometry type
  const renderModel = () => {
    switch (product.geometryType) {
      case 'box':
        return <ChairModel color={color} {...materialProps} />;
      case 'cylinder':
        return <LampModel color={color} {...materialProps} />;
      case 'lathe':
        return <VaseModel color={color} {...materialProps} />;
      case 'torus':
        return <RingModel color={color} {...materialProps} />;
      case 'combined':
        return <SculptureModel color={color} {...materialProps} />;
      default:
        return <ChairModel color={color} {...materialProps} />;
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[600px] rounded-lg overflow-hidden">
      <Suspense fallback={<Skeleton className="w-full h-full" />}>
        <Scene>
          {renderModel()}
        </Scene>
      </Suspense>
    </div>
  );
}
