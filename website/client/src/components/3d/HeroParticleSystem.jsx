import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Simplex Noise GLSL implementation
const simplexNoiseGLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
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

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

const particleVertexShader = `
uniform float uTime;
uniform float uMorph;
uniform float uAssemble;
uniform float uDisperse;
uniform float uPulse;
uniform vec3 uPointer;
uniform float uPixelRatio;
uniform float uTheme;
uniform float uFocus;

attribute vec3 positionA;
attribute vec3 positionB;
attribute vec3 positionC;
attribute vec3 positionD;
attribute vec3 positionE;
attribute float aSeed;
attribute float aSize;

varying float vBlur;
varying float vSeed;
varying float vDispersal;
varying float vDepthFactor;
varying float vPulseGlow;

${simplexNoiseGLSL}

vec3 getMorphPosition(float morph) {
  float m = clamp(morph, 0.0, 4.0);
  if (m < 1.0) {
    float t = smoothstep(0.0, 1.0, m);
    return mix(positionA, positionB, t);
  } else if (m < 2.0) {
    float t = smoothstep(0.0, 1.0, m - 1.0);
    return mix(positionB, positionC, t);
  } else if (m < 3.0) {
    float t = smoothstep(0.0, 1.0, m - 2.0);
    return mix(positionC, positionD, t);
  } else {
    float t = smoothstep(0.0, 1.0, m - 3.0);
    return mix(positionD, positionE, t);
  }
}

void main() {
  vSeed = aSeed;
  
  // 1. Morph interpolation between active targets
  vec3 targetPos = getMorphPosition(uMorph);

  // 2. Low-frequency 3D noise for organic texture (subtle float so headset geometry stays crisp)
  vec3 noiseCoord = targetPos * 0.65 + vec3(uTime * 0.12, uTime * 0.1, uTime * 0.08) + vec3(aSeed * 0.4);
  float bump = snoise(noiseCoord) * 0.025;
  vec3 norm = normalize(targetPos + vec3(0.001));
  vec3 pos = targetPos + norm * bump;

  // 3. Sound-wave pulses: 2-3 concentric ripples expanding from ear cups every ~2.5s
  vec3 cupL = vec3(-1.02, -0.38, 0.0);
  vec3 cupR = vec3(1.02, -0.38, 0.0);
  float distL = length(targetPos - cupL);
  float distR = length(targetPos - cupR);
  float distCup = min(distL, distR);

  float waveFront = uPulse * 1.35;
  float waveDist = distCup - waveFront;
  float ripple = sin(waveDist * 28.0) * smoothstep(0.35, 0.0, abs(waveDist)) * (1.0 - uPulse);

  vec3 nearestCup = distL < distR ? cupL : cupR;
  vec3 rippleDir = normalize(targetPos - nearestCup + vec3(0.001));
  pos += rippleDir * ripple * 0.07;

  // Pulse glow factor: cups glow on pulse and expanding ripples highlight
  vPulseGlow = max(0.0, ripple * 0.8) + smoothstep(0.42, 0.0, distCup) * sin(uPulse * 3.14159) * 0.55;

  // 4. Shed particles drifting off the microphone side (-X, +Z)
  vDispersal = 0.0;
  if (aSeed > 0.84 && pos.x < -0.15 && pos.z > 0.15) {
    float lifetime = fract(uTime * 0.28 + aSeed * 6.2831);
    vDispersal = lifetime;
    
    vec3 driftDir = vec3(-0.9, -0.22, 1.2);
    vec3 turbulence = vec3(
      snoise(pos * 0.4 + vec3(uTime * 0.15)),
      snoise(pos * 0.4 + vec3(uTime * 0.15 + 10.0)),
      snoise(pos * 0.4 + vec3(uTime * 0.15 + 20.0))
    ) * 0.45;
    
    pos += (driftDir + turbulence) * (lifetime * 2.0 * uDisperse);
  }

  // 5. Pointer repulsion (radius ~0.65 world units, smoothly eased)
  vec3 toPointer = pos - uPointer;
  float distToPointer = length(toPointer.xy);
  float repulsionRadius = 0.65;
  if (distToPointer < repulsionRadius) {
    float factor = smoothstep(repulsionRadius, 0.0, distToPointer);
    pos += normalize(vec3(toPointer.xy, 0.3)) * factor * 0.45;
  }

  // 6. Intro assembly from scattered noise over ~1.6s
  if (uAssemble < 1.0) {
    float easeAssemble = smoothstep(0.0, 1.0, uAssemble);
    vec3 scatter = vec3(
      snoise(targetPos * 1.5 + vec3(aSeed * 12.0)),
      snoise(targetPos * 1.5 + vec3(aSeed * 24.0)),
      snoise(targetPos * 1.5 + vec3(aSeed * 36.0))
    ) * 7.0;
    pos = mix(scatter, pos, easeAssemble);
  }

  // 7. View space projection
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // 8. Depth of Field fake blur: far points are larger and softer for depth
  float distFromFocus = abs(-mvPosition.z - uFocus);
  vBlur = clamp(distFromFocus * 0.32, 0.0, 1.0);
  vDepthFactor = clamp((-mvPosition.z - 3.5) / 4.0, 0.0, 1.0);

  // gl_PointSize scaled by distance, blur factor, and theme (crisp glowing points)
  float themeSizeBoost = mix(1.0, 1.15, uTheme);
  float sizeBoost = (1.0 + vBlur * 1.3) * themeSizeBoost;
  gl_PointSize = (aSize * sizeBoost * uPixelRatio * 18.0) / -mvPosition.z;
}
`;

const particleFragmentShader = `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uOpacity;
uniform float uTheme;

varying float vBlur;
varying float vSeed;
varying float vDispersal;
varying float vDepthFactor;
varying float vPulseGlow;

void main() {
  // Soft circular sprite (distance from point center [0.0, 0.5])
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;

  // Soft circular sprite falloff based on blur
  float blurEdge = 0.5 - vBlur * 0.22;
  float alpha = smoothstep(0.5, blurEdge, dist);

  // Brighter glowing core
  float core = smoothstep(0.3, 0.0, dist);

  // Color blending: uColorA -> uColorB -> uColorC (core highlight)
  vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 0.7, vSeed));
  col = mix(col, uColorC, core * 0.65 + pow(max(0.0, 1.0 - dist * 2.0), 2.2) * 0.35);

  // Sound-wave pulse glow: cups and concentric ripples highlight
  if (vPulseGlow > 0.0) {
    col = mix(col, uColorC, clamp(vPulseGlow * 0.75, 0.0, 1.0));
    alpha = clamp(alpha + vPulseGlow * 0.25, 0.0, 1.0);
  }

  // Shed particles luminescence and fade at end of cycle
  if (vDispersal > 0.0) {
    col = mix(col, uColorC, 0.45);
    alpha *= (1.0 - smoothstep(0.55, 1.0, vDispersal));
  }

  // Multiply by uniform opacity
  alpha *= uOpacity;

  // NormalBlending with Premultiplied Alpha for BOTH themes (NO additive blending)
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

// Pre-allocated static vectors outside component to eliminate GC pressure during pointer movement
const _tempVec = new THREE.Vector3();
const _tempWorldPos = new THREE.Vector3();

export default function HeroParticleSystem({
  geometry,
  isDark,
  morphTarget = 0,
  scrollControls,
}) {
  const meshRef = useRef();
  const materialRef = useRef();
  const pointerWorldRef = useRef(new THREE.Vector3(0, 0, 0));
  const pointerTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const isTouchRef = useRef(false);
  const assembleProgressRef = useRef(0);

  const { camera } = useThree();

  // Target theme color definitions
  // Dark:  #1F8A3A -> #5FBF4A -> #B8E08A core
  // Light: #425832 -> #54703F -> #94B380
  const themeColors = useMemo(() => {
    return {
      dark: {
        colorA: new THREE.Color('#1F8A3A'),
        colorB: new THREE.Color('#5FBF4A'),
        colorC: new THREE.Color('#B8E08A'),
        opacity: 0.92,
      },
      light: {
        colorA: new THREE.Color('#425832'),
        colorB: new THREE.Color('#54703F'),
        colorC: new THREE.Color('#94B380'),
        opacity: 0.98,
      },
    };
  }, []);

  // Material uniforms
  const uniforms = useMemo(() => {
    const curTheme = isDark ? themeColors.dark : themeColors.light;
    return {
      uTime: { value: 0 },
      uMorph: { value: morphTarget },
      uAssemble: { value: 0.0 }, // Intro assemble starts at 0.0
      uDisperse: { value: 1.0 },
      uPulse: { value: 0.0 }, // Sound-wave ripple cycle (2.5s)
      uPointer: { value: new THREE.Vector3(999, 999, 0) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.5) },
      uTheme: { value: isDark ? 0.0 : 1.0 },
      uColorA: { value: curTheme.colorA.clone() },
      uColorB: { value: curTheme.colorB.clone() },
      uColorC: { value: curTheme.colorC.clone() },
      uOpacity: { value: curTheme.opacity },
      uFocus: { value: 5.4 },
    };
  }, []);

  // Clean up shader material on unmount
  useEffect(() => {
    return () => {
      if (materialRef.current) {
        materialRef.current.dispose();
      }
    };
  }, []);

  // Detect touch device
  useEffect(() => {
    isTouchRef.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Listen to pointer movements on window and convert to world coordinates at z=0 without allocations
  useEffect(() => {
    if (isTouchRef.current) return;

    let rafId = null;
    const handlePointerMove = (e) => {
      if (rafId) return;
      const clientX = e.clientX;
      const clientY = e.clientY;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        // Normalized device coordinates [-1, 1]
        const ndcX = (clientX / window.innerWidth) * 2 - 1;
        const ndcY = -(clientY / window.innerHeight) * 2 + 1;

        // Project onto world z=0 plane using pre-allocated vectors
        _tempVec.set(ndcX, ndcY, 0.5);
        _tempVec.unproject(camera);
        _tempVec.sub(camera.position).normalize();
        const distance = -camera.position.z / _tempVec.z;
        _tempWorldPos.copy(camera.position).addScaledVector(_tempVec, distance);

        pointerTargetRef.current.set(_tempWorldPos.x, _tempWorldPos.y, 0);
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [camera]);

  useFrame((state, delta) => {
    if (!materialRef.current || !meshRef.current) return;

    const u = materialRef.current.uniforms;

    // 1. Advance GPU time monotonically
    const time = state.clock.getElapsedTime();
    u.uTime.value = time;

    // 2. Sound-wave pulse cycle: every ~2.5s
    u.uPulse.value = (time % 2.5) / 2.5;

    // 3. Intro assembly over ~1.6s
    if (assembleProgressRef.current < 1.0) {
      assembleProgressRef.current = Math.min(assembleProgressRef.current + delta / 1.6, 1.0);
      u.uAssemble.value = assembleProgressRef.current;
    }

    // 4. Read spring values driven by useScroll + useSpring (if persistent)
    let targetMorphVal = morphTarget;
    let targetScaleVal = 1.0;
    let targetPosXVal = 0.0;
    let targetDisperseVal = 1.0;
    let targetOpacityMult = 1.0;

    if (scrollControls) {
      if (scrollControls.springMorph) targetMorphVal = scrollControls.springMorph.get();
      if (scrollControls.springScale) targetScaleVal = scrollControls.springScale.get();
      if (scrollControls.springPosX) targetPosXVal = scrollControls.springPosX.get();
      if (scrollControls.springDisperse) targetDisperseVal = scrollControls.springDisperse.get();
      if (scrollControls.springOpacity) targetOpacityMult = scrollControls.springOpacity.get();
    }

    u.uMorph.value = targetMorphVal;
    u.uDisperse.value = targetDisperseVal;

    // Smooth position and scale on mesh
    meshRef.current.position.x = targetPosXVal;
    meshRef.current.scale.setScalar(targetScaleVal);

    // 5. Pointer repulsion lerping / Autonomous drift on touch devices
    if (isTouchRef.current) {
      // Autonomous gentle organic drift on touch devices
      const autoX = Math.sin(time * 0.45) * 1.1;
      const autoY = Math.cos(time * 0.35) * 0.7;
      pointerWorldRef.current.set(autoX, autoY, 0);
      u.uPointer.value.copy(pointerWorldRef.current);
    } else {
      // Eased lerp towards mouse pointer
      pointerWorldRef.current.lerp(pointerTargetRef.current, 0.08);
      u.uPointer.value.copy(pointerWorldRef.current);
    }

    // 6. Theme change tweening over ~600ms (only compute when transitioning)
    const targetThemeVal = isDark ? 0.0 : 1.0;
    if (Math.abs(u.uTheme.value - targetThemeVal) > 0.001) {
      const lerpSpeed = Math.min(delta * 5.2, 1.0);
      u.uTheme.value = THREE.MathUtils.lerp(u.uTheme.value, targetThemeVal, lerpSpeed);

      const activeTheme = isDark ? themeColors.dark : themeColors.light;
      u.uColorA.value.lerp(activeTheme.colorA, lerpSpeed);
      u.uColorB.value.lerp(activeTheme.colorB, lerpSpeed);
      u.uColorC.value.lerp(activeTheme.colorC, lerpSpeed);
      u.uOpacity.value = THREE.MathUtils.lerp(
        u.uOpacity.value,
        activeTheme.opacity * targetOpacityMult,
        lerpSpeed
      );
    }

    // 7. Idle Motion:
    // - Slow yaw oscillation of ~+/-35 degrees (+/-0.61 rad) so mic stays visible
    // - Gentle vertical float
    // - Pointer tilt lerped with max ~0.25 rad
    const yawBase = Math.sin(time * 0.42) * 0.61;
    const maxTilt = 0.25;
    const targetTiltX = isTouchRef.current
      ? 0
      : THREE.MathUtils.clamp(pointerWorldRef.current.x * 0.09, -maxTilt, maxTilt);
    const targetTiltY = isTouchRef.current
      ? 0
      : THREE.MathUtils.clamp(pointerWorldRef.current.y * 0.09, -maxTilt, maxTilt);

    meshRef.current.rotation.y = yawBase + targetTiltX;
    meshRef.current.rotation.x = -targetTiltY + Math.sin(time * 0.3) * 0.04;
    meshRef.current.rotation.z = Math.sin(time * 0.4) * 0.03;
    meshRef.current.position.y = Math.sin(time * 0.7) * 0.07;
  });

  return (
    <points ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
