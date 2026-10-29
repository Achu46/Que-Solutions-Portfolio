import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// GLSL 3D Simplex Noise Definition
const simplexNoiseGLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

// Particle Vertex Shader: organic noise deformation, trailing dispersal, view edge glow & DOF calculation
const particleVertexShader = `
uniform float uTime;
uniform float uPixelRatio;
uniform vec2 uPointer;
uniform float uLayer; // -1.0 for back only (behind headline), 1.0 for front only (in front of headline), 0.0 for all

attribute vec3 aRandomness;
attribute float aSize;
attribute float aDispersal;

varying float vEdgeGlow;
varying float vDofBlur;
varying float vDispersal;

${simplexNoiseGLSL}

void main() {
  vDispersal = aDispersal;
  
  // Base organic shape with noisy bumpy surface
  vec3 pos = position;
  
  // 3D Simplex displacement
  vec3 noiseCoord = pos * 0.75 + vec3(uTime * 0.18, uTime * 0.12, uTime * 0.08) + aRandomness * 0.1;
  float displacement = snoise(noiseCoord) * 0.48;
  
  // Displace along normal
  vec3 norm = normalize(pos);
  vec3 displacedPos = pos + norm * displacement;
  
  // Trailing dispersal shedding off to the right side
  if (aDispersal > 0.05) {
    float driftTime = mod(uTime * 0.6 + aRandomness.x * 6.28, 6.28);
    float streamProgress = driftTime / 6.28;
    
    // Dispersal vector: outward and rightward
    vec3 driftDir = vec3(1.6, 0.65, 0.4);
    float driftTurbulence = snoise(pos * 0.5 + vec3(uTime * 0.2)) * 0.6;
    displacedPos += driftDir * (streamProgress * 2.8 * aDispersal) + vec3(0.0, driftTurbulence, 0.0);
  }

  // Pointer tilt & parallax
  float rotY = uPointer.x * 0.25;
  float rotX = -uPointer.y * 0.2;
  
  // Apply rotation
  mat3 rotYMat = mat3(
    cos(rotY), 0.0, sin(rotY),
    0.0, 1.0, 0.0,
    -sin(rotY), 0.0, cos(rotY)
  );
  mat3 rotXMat = mat3(
    1.0, 0.0, 0.0,
    0.0, cos(rotX), -sin(rotX),
    0.0, sin(rotX), cos(rotX)
  );
  
  displacedPos = rotXMat * rotYMat * displacedPos;

  // View position & Camera projection
  vec4 mvPosition = modelViewMatrix * vec4(displacedPos, 1.0);

  // Depth clipping to split particles into back and front layers around headline plane (mvPosition.z ~ -5.35)
  if (uLayer < -0.5 && mvPosition.z > -5.35) {
    gl_Position = vec4(999.0, 999.0, 999.0, 1.0);
    return;
  }
  if (uLayer > 0.5 && mvPosition.z <= -5.35) {
    gl_Position = vec4(999.0, 999.0, 999.0, 1.0);
    return;
  }

  gl_Position = projectionMatrix * mvPosition;

  // Edge lighting / Rim calculation: dots facing edge glow brighter
  vec3 viewDir = normalize(-mvPosition.xyz);
  vec3 transformedNorm = normalize(normalMatrix * norm);
  float rim = 1.0 - max(dot(viewDir, transformedNorm), 0.0);
  vEdgeGlow = pow(rim, 2.2);

  // Depth of field (DOF): distance from focal plane (z around -5.5)
  float focalDistance = 5.5;
  float distFromFocal = abs(-mvPosition.z - focalDistance);
  vDofBlur = clamp(distFromFocal * 0.35, 0.0, 1.0);

  // Point size attenuation
  float sizeBoost = 1.0 + vEdgeGlow * 0.8 + vDofBlur * 0.6;
  gl_PointSize = (aSize * sizeBoost * uPixelRatio * 38.0) / -mvPosition.z;
}
`;

// Particle Fragment Shader: soft glowing dots, brighter lit edge, and depth of field blur
const particleFragmentShader = `
uniform vec3 uColorCore;
uniform vec3 uColorEdge;
uniform vec3 uColorHighlight;
uniform float uThemeFactor;

varying float vEdgeGlow;
varying float vDofBlur;
varying float vDispersal;

void main() {
  // Distance from point center [0.0, 0.5]
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;

  // Soft circle falloff with DOF blur simulation
  float blurEdge = 0.5 - vDofBlur * 0.22;
  float alpha = smoothstep(0.5, blurEdge, dist);

  // Core color blending towards glowing lit edge
  vec3 col = mix(uColorCore, uColorEdge, vEdgeGlow * 0.7);
  
  // Highlight edge glow (bright olive-lime #B8E08A)
  col = mix(col, uColorHighlight, pow(vEdgeGlow, 1.8) * 0.85);

  // Shedding particles have trailing luminescence
  if (vDispersal > 0.1) {
    col = mix(col, uColorHighlight, 0.4);
    alpha *= (1.0 - vDispersal * 0.45);
  }

  // Final glow intensity based on edge
  float intensity = 1.1 + vEdgeGlow * 1.4;

  gl_FragColor = vec4(col * intensity, alpha * 0.85);
}
`;

// Generate 42,000 Particles with Organic Shape + Trailing Dispersal
function useParticleGeometry() {
  return useMemo(() => {
    const count = 42000;
    const positions = new Float32Array(count * 3);
    const randomness = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const dispersal = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 80% on main organic form, 20% in trailing dispersal cloud
      const isDispersal = Math.random() < 0.22;
      dispersal[i] = isDispersal ? Math.random() : 0.0;

      // Organic Torus / Ribbon surface coordinates
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      const R = 2.1 + (Math.random() - 0.5) * 0.35; // Major radius
      const r = 0.85 + (Math.random() - 0.5) * 0.45; // Minor radius

      // Organic shape with twist
      const x = (R + r * Math.cos(v)) * Math.cos(u);
      const y = (R + r * Math.cos(v)) * Math.sin(u) * 0.65 + Math.sin(u * 2.0) * 0.35;
      const z = r * Math.sin(v) + Math.cos(u) * 0.4;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      randomness[i3] = Math.random() * 2.0 - 1.0;
      randomness[i3 + 1] = Math.random() * 2.0 - 1.0;
      randomness[i3 + 2] = Math.random() * 2.0 - 1.0;

      // Varied dot size for depth texture
      sizes[i] = Math.random() * 0.8 + 0.4;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aDispersal', new THREE.BufferAttribute(dispersal, 1));
    return geometry;
  }, []);
}

function ParticleCloudMesh({ isDark, layer = 'all' }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const pointerRef = useRef({ x: 0, y: 0 });
  const geometry = useParticleGeometry();

  const layerFactor = layer === 'back' ? -1.0 : layer === 'front' ? 1.0 : 0.0;

  // Uniforms
  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.75) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uLayer: { value: layerFactor },
      uColorCore: { value: new THREE.Color(isDark ? '#54703F' : '#425832') },
      uColorEdge: { value: new THREE.Color(isDark ? '#94B380' : '#6C8C54') },
      uColorHighlight: { value: new THREE.Color(isDark ? '#B8E08A' : '#54703F') },
      uThemeFactor: { value: isDark ? 1.0 : 0.0 },
    };
  }, [layerFactor]);

  // Update uniform colors and layer on change without canvas remount
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColorCore.value.set(isDark ? '#54703F' : '#425832');
      materialRef.current.uniforms.uColorEdge.value.set(isDark ? '#94B380' : '#6C8C54');
      materialRef.current.uniforms.uColorHighlight.value.set(isDark ? '#B8E08A' : '#54703F');
      materialRef.current.uniforms.uThemeFactor.value = isDark ? 1.0 : 0.0;
      materialRef.current.uniforms.uLayer.value = layerFactor;
    }
  }, [isDark, layerFactor]);

  useEffect(() => {
    const handlePointerMove = (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  useFrame((state, delta) => {
    if (!materialRef.current || !meshRef.current) return;

    // Advance GPU time synchronously based on monotonic clock
    const globalTime = (performance.now() * 0.001) * 0.9;
    materialRef.current.uniforms.uTime.value = globalTime;

    // Smooth pointer lerp
    const targetX = pointerRef.current.x;
    const targetY = pointerRef.current.y;
    const curX = materialRef.current.uniforms.uPointer.value.x;
    const curY = materialRef.current.uniforms.uPointer.value.y;
    materialRef.current.uniforms.uPointer.value.x = THREE.MathUtils.lerp(curX, targetX, 0.05);
    materialRef.current.uniforms.uPointer.value.y = THREE.MathUtils.lerp(curY, targetY, 0.05);

    // Subtle 3D mesh slow rotation and breathing float - synchronous across layers
    meshRef.current.rotation.y = globalTime * 0.12;
    meshRef.current.rotation.z = Math.sin(globalTime * 0.3) * 0.06;
    meshRef.current.position.y = Math.sin(globalTime * 0.5) * 0.12;
  });

  return (
    <points ref={meshRef} geometry={geometry} position={[0.4, 0.1, 0]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

// 2D CSS/SVG Fallback Poster for Low-Tier / Reduced-Motion
function ParticleFallbackPoster({ isDark }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
      <div 
        className="w-[480px] h-[480px] sm:w-[600px] sm:h-[600px] rounded-full blur-3xl opacity-30 animate-pulse-slow"
        style={{
          background: isDark 
            ? 'radial-gradient(circle, #B8E08A 0%, #54703F 45%, transparent 75%)' 
            : 'radial-gradient(circle, #6C8C54 0%, #D7E3CD 55%, transparent 75%)'
        }}
      />
    </div>
  );
}

export default function OrganicParticleCloud({ layer = 'all' }) {
  const { isDark } = useTheme();
  const [canRender3D, setCanRender3D] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLowTier = 
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
      (navigator.connection && navigator.connection.saveData);

    if (prefersReducedMotion || isLowTier) {
      setCanRender3D(false);
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setCanRender3D(false);
    } catch {
      setCanRender3D(false);
    }
  }, []);

  if (!canRender3D) {
    if (layer === 'front') return null;
    return <ParticleFallbackPoster isDark={isDark} />;
  }

  const containerZIndex = layer === 'front' ? 'z-20' : 'z-0';

  return (
    <div className={`absolute inset-0 ${containerZIndex} pointer-events-none select-none`} aria-hidden="true">
      <Suspense fallback={layer === 'front' ? null : <ParticleFallbackPoster isDark={isDark} />}>
        <Canvas
          camera={{ position: [0, 0, 5.4], fov: 45 }}
          dpr={[1, 1.75]}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
        >
          <ParticleCloudMesh isDark={isDark} layer={layer} />
        </Canvas>
      </Suspense>
    </div>
  );
}
