import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { getParticleGeometry } from './particleGeometry';
import HeroParticleSystem from './HeroParticleSystem';
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
function Hero3DScene({ isDark, isPersistent = false, clipPath = 'none', scrollControls }) {
  const containerRef = useRef(null);
  const [geometry, setGeometry] = useState(null);
  const [morphTarget, setMorphTarget] = useState(0.0);
  const [frameloop, setFrameloop] = useState('always');
  
// Device classification & Particle budget: 6k high, 4.5k mid, 3k tablet, 1.8k phone for silky 60fps
  const [deviceTier, setDeviceTier] = useState(() => {
    if (typeof window === 'undefined') return { isPhone: false, isHighTier: true, maxCount: 6000, initialDpr: 1.15 };
    const w = window.innerWidth;
    const isPhone = w < 640;
    const isTablet = w >= 640 && w < 1024;
    const isMidDesktop = w >= 1024 && w < 1440;
    const isHighTier = w >= 1440;

    let maxCount = 6000;
    let initialDpr = 1.15;
    if (isPhone) {
      maxCount = 1800;
      initialDpr = 1.0;
    } else if (isTablet) {
      maxCount = 3000;
      initialDpr = 1.05;
    } else if (isMidDesktop) {
      maxCount = 4500;
      initialDpr = 1.1;
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
    if (isPersistent) {
      // In persistent full-page mode, pause only when tab is hidden
      const handleVisibilityChange = () => {
        setFrameloop(!document.hidden ? 'always' : 'never');
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }

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
  }, [isPersistent]);

  // PerformanceMonitor fallback: step down under 45 FPS
  const handlePerformanceDecline = () => {
    setActiveCount((cur) => {
      if (cur > 12000) return 12000;
      if (cur > 8000) return 8000;
      if (cur > 5000) return 5000;
      return cur;
    });
    setDpr((cur) => Math.max(1.0, cur - 0.2));
  };

  const dprRange = useMemo(() => {
    if (deviceTier.isPhone) return [1.0, 1.25];
    return [1.0, Math.min(dpr, 1.5)];
  }, [deviceTier.isPhone, dpr]);

  const containerClasses = isPersistent
    ? "fixed inset-0 z-[5] pointer-events-none select-none transition-[clip-path] duration-75"
    : "absolute inset-0 z-0 pointer-events-none select-none";

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={{
        clipPath: isPersistent ? clipPath : undefined,
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5.6], fov: 45, near: 0.1, far: 50 }}
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
            scrollControls={scrollControls}
          />
        )}
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
export default function Hero3DCanvas({ isPersistent = false, clipPath = 'none', scrollControls }) {
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
    if (isPersistent) return null;
    return <HeroPosterFallback isDark={isDark} />;
  }

  return (
    <Hero3DErrorBoundary isDark={isDark}>
      <Suspense fallback={isPersistent ? null : <HeroPosterFallback isDark={isDark} />}>
        <Hero3DScene
          isDark={isDark}
          isPersistent={isPersistent}
          clipPath={clipPath}
          scrollControls={scrollControls}
        />
      </Suspense>
    </Hero3DErrorBoundary>
  );
}
