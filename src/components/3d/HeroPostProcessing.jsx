import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';

export default function HeroPostProcessing({ isDark, isHighTierDesktop }) {
  // Postprocessing (Bloom only) on high-tier desktop only; none on mid-range and phones
  if (!isHighTierDesktop) return null;

  const bloomRef = useRef();

  useFrame((_, delta) => {
    // 600ms tween for bloom intensity
    // Bloom active in dark mode; smoothly tweens down in light mode
    const targetBloom = isDark ? 0.65 : 0.0;
    const lerpSpeed = Math.min(delta * 5.2, 1.0);

    if (bloomRef.current) {
      bloomRef.current.intensity = THREE.MathUtils.lerp(
        bloomRef.current.intensity,
        targetBloom,
        lerpSpeed
      );
    }
  });

  return (
    <EffectComposer multisampling={0} disableNormalPass>
      <Bloom
        ref={bloomRef}
        intensity={isDark ? 0.65 : 0.0}
        luminanceThreshold={0.25}
        luminanceSmoothing={0.85}
        mipmapBlur={true}
      />
    </EffectComposer>
  );
}
