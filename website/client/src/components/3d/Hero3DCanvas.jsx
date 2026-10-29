import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { getParticleGeometry } from './particleGeometry';
import HeroParticleSystem from './HeroParticleSystem';
import HeroPostProcessing from './HeroPostProcessing';
import HeroPosterFallback from './HeroPosterFallback';
import Hero3DErrorBoundary from './Hero3DErrorBoundary';

/**
 * PHASE 2 Hero 3D Particle Canvas
 * - Adaptive particle counts: 60k (desktop high), 30k (mid), 20k (tablet), 12k (phone)
 * - drei PerformanceMonitor steps count/dpr down under 45 FPS
 * - Postprocessing: animated Bloom, Vignette, DepthOfField (high-tier desktop only)
 * - frameloop="always" when in view; "never" when off-screen or tab hidden
 * - Strict fallbacks: no WebGL, prefers-reduced-motion, low-tier device, runtime ErrorBoundary
 */
function Hero3DScene({ isDark }) {
  const containerRef = useRef(null);
  const [geometry, setGeometry] = useState(null);
  const [morphTarget, setMorphTarget] = useState(0.0);
  const [frameloop, setFrameloop] = useState('always');
  
  // Device classification
  const [deviceTier, setDeviceTier] = useState(() => {
    if (typeof window === 'undefined') return { isPhone: false, isHighTier: true, maxCount: 60000, initialDpr: 1.75 };
    const w = window.innerWidth;
    const isPhone = w < 640;
    const isTablet = w >= 640 && w < 1024;
    const isMidDesktop = w >= 1024 && w < 1440;
    const isHighTier = w >= 1440;

    let maxCount = 60000;
    let initialDpr = 1.75;
    if (isPhone) {
      maxCount = 12000;
      initialDpr = 1.35;
    } else if (isTablet) {
      maxCount = 20000;
      initialDpr = 1.5;
    } else if (isMidDesktop) {
      maxCount = 30000;
      initialDpr = 1.6;
    }

    return { isPhone, isTablet, isHighTier, maxCount, initialDpr };
  });

  const [activeCount, setActiveCount] = useState(deviceTier.maxCount);
  const [dpr, setDpr] = useState(deviceTier.initialDpr);

  // 1. Initialize morph targets geometry
  useEffect(() => {
    let active = true;
    getParticleGeometry(deviceTier.maxCount).then((geo) => {
      if (active) {
        geo.setDrawRange(0, activeCount);
        setGeometry(geo);
      }
    });

    return () => {
      active = false;
      if (geometry) {
        geometry.dispose();
      }
    };
  }, [deviceTier.maxCount]);

  // Update draw range when active count adapts
  useEffect(() => {
    if (geometry) {
      geometry.setDrawRange(0, activeCount);
    }
  }, [geometry, activeCount]);

  // 2. IntersectionObserver + Page Visibility to pause rendering when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let isIntersecting = true;
    let isDocumentVisible = !document.hidden;

    const updateFrameloop = () => {
      if (isIntersecting && isDocumentVisible) {
        setFrameloop('always');
      } else {
        setFrameloop('never');
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          updateFrameloop();
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
      updateFrameloop();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // PerformanceMonitor fallback: step down under 45 FPS
  const handlePerformanceDecline = () => {
    setActiveCount((cur) => {
      if (cur > 30000) return 30000;
      if (cur > 20000) return 20000;
      if (cur > 12000) return 12000;
      return cur;
    });
    setDpr((cur) => Math.max(1.0, cur - 0.25));
  };

  const dprRange = useMemo(() => {
    if (deviceTier.isPhone) return [1.0, 1.35];
    return [1.0, Math.min(dpr, 1.75)];
  }, [deviceTier.isPhone, dpr]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none select-none"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5.4], fov: 45, near: 0.1, far: 50 }}
        dpr={dprRange}
        frameloop={frameloop}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance',
          premultipliedAlpha: true,
          depth: false,
          stencil: false,
        }}
        style={{ background: 'transparent' }}
      >
        <PerformanceMonitor
          onDecline={handlePerformanceDecline}
          flipflops={3}
          bounds={(fps) => [45, 60]}
        />

        {geometry && (
          <HeroParticleSystem
            geometry={geometry}
            isDark={isDark}
            morphTarget={morphTarget}
          />
        )}

        <HeroPostProcessing
          isDark={isDark}
          isHighTierDesktop={deviceTier.isHighTier}
          isPhone={deviceTier.isPhone}
        />
      </Canvas>
    </div>
  );
}

/**
 * Main Export with Complete Fallback Guard:
 * - Checks WebGL support
 * - Respects prefers-reduced-motion
 * - Checks low-tier hardware (hardwareConcurrency <= 4, deviceMemory <= 4, or Save-Data)
 * - Wraps in Hero3DErrorBoundary
 */
export default function Hero3DCanvas() {
  const { isDark } = useTheme();
  const [canRender3D, setCanRender3D] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // 2. Low-tier device detection
    const isLowTier =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
      (navigator.connection && navigator.connection.saveData);

    if (prefersReducedMotion || isLowTier) {
      setCanRender3D(false);
      return;
    }

    // 3. WebGL capability probe
    try {
      const probeCanvas = document.createElement('canvas');
      const gl =
        probeCanvas.getContext('webgl2') ||
        probeCanvas.getContext('webgl') ||
        probeCanvas.getContext('experimental-webgl');
      if (!gl) {
        setCanRender3D(false);
      }
    } catch {
      setCanRender3D(false);
    }
  }, []);

  if (!canRender3D) {
    return <HeroPosterFallback isDark={isDark} />;
  }

  return (
    <Hero3DErrorBoundary isDark={isDark}>
      <Suspense fallback={<HeroPosterFallback isDark={isDark} />}>
        <Hero3DScene isDark={isDark} />
      </Suspense>
    </Hero3DErrorBoundary>
  );
}
