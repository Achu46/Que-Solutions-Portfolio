import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import Fallback2D from './Fallback2D';
import SupportHubHero3D from './SupportHubHero3D';
import ScrollMorphCanvas from './ScrollMorphCanvas';

// Branded loading spinner during lazy load
function CanvasLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
      <div className="w-10 h-10 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
    </div>
  );
}

export default function SceneContainer() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowTier, setIsLowTier] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    // 1. Reduced motion detection
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionListener = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionListener);

    // 2. WebGL capability check
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }

    // 3. Hardware tier detection (cores <= 4 or ram <= 4)
    if (
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4)
    ) {
      setIsLowTier(true);
    }

    // 4. Tab visibility pause
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      motionQuery.removeEventListener('change', motionListener);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // If WebGL is unavailable or reduced-motion is requested, render zero-loop 2D fallback
  if (!hasWebGL || prefersReducedMotion) {
    return <Fallback2D />;
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Suspense fallback={<CanvasLoader />}>
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          dpr={[1, 1.75]} // Cap DPR to 1.75 for high performance
          frameloop={isTabVisible ? 'always' : 'never'} // Pause when tab is hidden
          gl={{
            powerPreference: 'high-performance',
            antialias: !isLowTier,
            alpha: true,
            stencil: false,
            depth: true,
          }}
        >
          {/* Hero 3D lives in its dedicated stage inside HeroSection */}
          <ScrollMorphCanvas isLowTier={isLowTier} />
        </Canvas>
      </Suspense>
    </div>
  );
}
