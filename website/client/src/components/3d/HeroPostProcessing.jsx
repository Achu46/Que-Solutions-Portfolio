import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';

export default function HeroPostProcessing({ isDark, isHighTierDesktop, isPhone }) {
  // If phone, completely omit postprocessing to ensure 30fps+ and low GPU fillrate
  if (isPhone) return null;

  const bloomRef = useRef();
  const vignetteRef = useRef();

  useFrame((_, delta) => {
    // 600ms tween for bloom intensity and vignette
    // Bloom ONLY in dark mode (intensity 0 in light mode)
    const targetBloom = isDark ? 0.65 : 0.0;
    const targetVignette = isDark ? 0.55 : 0.22;
    const lerpSpeed = Math.min(delta * 5.2, 1.0);

    if (bloomRef.current) {
      bloomRef.current.intensity = THREE.MathUtils.lerp(
        bloomRef.current.intensity,
        targetBloom,
        lerpSpeed
      );
    }
    if (vignetteRef.current) {
      vignetteRef.current.darkness = THREE.MathUtils.lerp(
        vignetteRef.current.darkness,
        targetVignette,
        lerpSpeed
      );
    }
  });

  return (
    <EffectComposer multisampling={0} disableNormalPass>
      {/* Bloom ONLY active in dark mode; smoothly tweens to 0 in light mode */}
      <Bloom
        ref={bloomRef}
        intensity={isDark ? 0.65 : 0.0}
        luminanceThreshold={0.25}
        luminanceSmoothing={0.85}
        mipmapBlur={true}
      />

      {/* Light Vignette */}
      <Vignette
        ref={vignetteRef}
        eskil={false}
        offset={0.28}
        darkness={isDark ? 0.55 : 0.22}
      />

      {/* DepthOfField: ONLY on high-tier desktop */}
      {isHighTierDesktop && (
        <DepthOfField
          focusDistance={0.0}
          focalLength={0.025}
          bokehScale={2.2}
        />
      )}
    </EffectComposer>
  );
}
