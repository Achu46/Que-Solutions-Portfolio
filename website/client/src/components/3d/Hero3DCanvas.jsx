import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// Procedural 3D Lemniscate (Infinity Loop) Curve echoing the Que logo
class LemniscateCurve extends THREE.Curve {
  constructor(scale = 2.2) {
    super();
    this.scale = scale;
  }
  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const point = optionalTarget;
    const u = t * Math.PI * 2;
    const a = this.scale;
    const sinU = Math.sin(u);
    const cosU = Math.cos(u);
    const denom = 1 + sinU * sinU;
    
    const x = (a * cosU) / denom;
    const y = 0.5 * Math.sin(u * 2);
    const z = (a * sinU * cosU) / denom;
    return point.set(x, y, z);
  }
}

// Orbiting Support Primitive 1: Stylized Headset
function SupportHeadset({ color }) {
  return (
    <group scale={0.35}>
      {/* Headband arch */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1, 0.12, 16, 32, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Earcups */}
      <mesh position={[-1, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.35, 16]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
      <mesh position={[1, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.35, 16]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
      {/* Mic boom */}
      <mesh position={[0.7, -0.4, 0.3]} rotation={[0.4, 0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <meshStandardMaterial color="#6C8C54" />
      </mesh>
    </group>
  );
}

// Orbiting Support Primitive 2: Chat Bubble
function SupportChatBubble({ color }) {
  return (
    <group scale={0.4}>
      <mesh>
        <sphereGeometry args={[0.8, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.25} clearcoat={0.6} />
      </mesh>
      {/* Tail */}
      <mesh position={[-0.5, -0.6, 0]} rotation={[0, 0, 0.8]}>
        <coneGeometry args={[0.3, 0.5, 16]} />
        <meshStandardMaterial color={color} roughness={0.25} />
      </mesh>
      {/* Internal Dots */}
      <mesh position={[-0.28, 0, 0.72]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 0, 0.78]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.28, 0, 0.72]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

// Orbiting Support Primitive 3: Phone Handset
function SupportPhone({ color }) {
  return (
    <group scale={0.35} rotation={[0.3, 0.2, 0.5]}>
      {/* Central handle */}
      <mesh>
        <cylinderGeometry args={[0.16, 0.16, 1.2, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* Earpiece */}
      <mesh position={[0, 0.6, 0.2]} rotation={[0.5, 0, 0]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
      {/* Mouthpiece */}
      <mesh position={[0, -0.6, 0.2]} rotation={[-0.5, 0, 0]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Orbiting Support Primitive 4: Verified Badge
function SupportBadge({ color }) {
  return (
    <group scale={0.32}>
      <mesh>
        <cylinderGeometry args={[0.8, 0.8, 0.15, 24]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Check symbol tick */}
      <mesh position={[0, 0, 0.1]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.15, 0.5, 0.08]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.2, 0.1, 0.1]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.15, 0.8, 0.08]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

// Main 3D Scene Inside Canvas
function SceneContent({ isDark }) {
  const groupRef = useRef();
  const ribbonRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  // Generate Lemniscate Tube Geometry once
  const tubeGeometry = useMemo(() => {
    const path = new LemniscateCurve(2.3);
    return new THREE.TubeGeometry(path, 128, 0.22, 20, true);
  }, []);

  // Theme-aware material colors
  const ribbonColor = isDark ? '#94B380' : '#54703F';
  const emissiveColor = isDark ? '#2D3A24' : '#000000';
  const emissiveIntensity = isDark ? 0.35 : 0;
  const orbitItemColor = isDark ? '#B8CEA8' : '#6C8C54';

  useEffect(() => {
    const handlePointerMove = (e) => {
      // Normalize pointer [-1, 1]
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Slow floating rotation
    groupRef.current.rotation.y += delta * 0.25;

    // Pointer parallax (max 0.15 rad)
    const targetRotX = mouseRef.current.y * 0.12;
    const targetRotZ = mouseRef.current.x * 0.12;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.05);

    // Scroll linked tilt
    const scrollY = window.scrollY || 0;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15 - (scrollY * 0.001);

    // Individual orbiting objects rotation
    const t = state.clock.elapsedTime;
    const obj1 = groupRef.current.getObjectByName('obj-headset');
    if (obj1) {
      obj1.position.set(Math.cos(t * 0.7) * 2.8, Math.sin(t * 1.1) * 0.6, Math.sin(t * 0.7) * 2.8);
      obj1.rotation.y = t * 0.8;
    }
    const obj2 = groupRef.current.getObjectByName('obj-chat');
    if (obj2) {
      obj2.position.set(Math.cos(t * 0.7 + Math.PI * 0.5) * 2.8, Math.sin(t * 0.9 + 1) * 0.5, Math.sin(t * 0.7 + Math.PI * 0.5) * 2.8);
      obj2.rotation.y = -t * 0.6;
    }
    const obj3 = groupRef.current.getObjectByName('obj-phone');
    if (obj3) {
      obj3.position.set(Math.cos(t * 0.7 + Math.PI) * 2.8, Math.sin(t * 1.2 + 2) * 0.6, Math.sin(t * 0.7 + Math.PI) * 2.8);
      obj3.rotation.z = t * 0.5;
    }
    const obj4 = groupRef.current.getObjectByName('obj-badge');
    if (obj4) {
      obj4.position.set(Math.cos(t * 0.7 + Math.PI * 1.5) * 2.8, Math.sin(t * 0.8 + 3) * 0.5, Math.sin(t * 0.7 + Math.PI * 1.5) * 2.8);
      obj4.rotation.x = t * 0.7;
    }
  });

  return (
    <>
      {/* Lighting tuned to theme */}
      <ambientLight intensity={isDark ? 0.4 : 0.85} color={isDark ? '#EBF1E6' : '#FFFFFF'} />
      <directionalLight position={[6, 8, 5]} intensity={isDark ? 1.0 : 1.4} color="#FFFFFF" castShadow />
      <directionalLight position={[-6, -4, -5]} intensity={isDark ? 0.3 : 0.4} color={isDark ? '#54703F' : '#D7E3CD'} />

      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Procedural Olive Ribbon Infinity Loop */}
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh ref={ribbonRef} geometry={tubeGeometry} castShadow receiveShadow>
            <meshPhysicalMaterial
              color={ribbonColor}
              emissive={emissiveColor}
              emissiveIntensity={emissiveIntensity}
              clearcoat={0.7}
              clearcoatRoughness={0.2}
              roughness={0.22}
              metalness={0.12}
            />
          </mesh>
        </Float>

        {/* Orbiting Support Primitives */}
        <group name="obj-headset">
          <SupportHeadset color={orbitItemColor} />
        </group>
        <group name="obj-chat">
          <SupportChatBubble color={orbitItemColor} />
        </group>
        <group name="obj-phone">
          <SupportPhone color={orbitItemColor} />
        </group>
        <group name="obj-badge">
          <SupportBadge color={orbitItemColor} />
        </group>

        {/* Soft Ground Contact Shadow */}
        <ContactShadows
          position={[0, -2.1, 0]}
          opacity={isDark ? 0.35 : 0.22}
          scale={8}
          blur={2.4}
          far={4}
          color={isDark ? '#000000' : '#425832'}
        />
      </group>
    </>
  );
}

// Fallback Poster Component for no-WebGL, reduced-motion, low-end devices & errors
export function HeroPosterFallback({ isDark }) {
  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] flex items-center justify-center select-none overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/10 via-transparent to-brand-400/10 rounded-3xl blur-2xl pointer-events-none" />
      
      {/* Decorative CSS Float Animated Infinity Silhouette */}
      <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center animate-float">
        <svg viewBox="0 0 200 120" className="w-full h-auto drop-shadow-2xl">
          <defs>
            <linearGradient id="infinityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#94B380' : '#54703F'} />
              <stop offset="50%" stopColor={isDark ? '#B8CEA8' : '#6C8C54'} />
              <stop offset="100%" stopColor={isDark ? '#94B380' : '#425832'} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M 50 60 C 20 20, 0 60, 50 100 C 100 140, 100 -20, 150 20 C 200 60, 180 100, 150 60 C 100 20, 100 100, 50 60 Z"
            fill="none"
            stroke="url(#infinityGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
        </svg>

        {/* Orbiting Badges */}
        <div className="absolute -top-2 left-6 p-2 rounded-xl border border-border bg-elevated shadow-lg text-xs font-semibold text-text">
          🎧 Live Voice
        </div>
        <div className="absolute top-1/2 -right-4 p-2 rounded-xl border border-border bg-elevated shadow-lg text-xs font-semibold text-text">
          💬 Instant Chat
        </div>
        <div className="absolute -bottom-2 left-12 p-2 rounded-xl border border-border bg-elevated shadow-lg text-xs font-semibold text-text">
          ✓ Verified SLA
        </div>
      </div>
    </div>
  );
}

// Error Boundary for WebGL canvas
class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn('[Hero3D Canvas Error, falling back to 2D poster]:', err.message);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Main Exported Hero 3D Component with Hardware Detection & Fallback
export default function Hero3DCanvas() {
  const { isDark } = useTheme();
  const [shouldRender3D, setShouldRender3D] = useState(true);

  useEffect(() => {
    // 1. Reduced motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setShouldRender3D(false);
      return;
    }

    // 2. Low-tier device check (cores <= 4, memory <= 4, or Save-Data header)
    const isLowTier = 
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
      (navigator.connection && navigator.connection.saveData);

    if (isLowTier) {
      setShouldRender3D(false);
      return;
    }

    // 3. WebGL support check
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setShouldRender3D(false);
        return;
      }
    } catch {
      setShouldRender3D(false);
      return;
    }
  }, []);

  if (!shouldRender3D) {
    return <HeroPosterFallback isDark={isDark} />;
  }

  return (
    <CanvasErrorBoundary fallback={<HeroPosterFallback isDark={isDark} />}>
      <div 
        className="relative w-full h-[400px] sm:h-[480px] lg:h-[560px] select-none pointer-events-auto"
        aria-hidden="true"
      >
        <Suspense fallback={<HeroPosterFallback isDark={isDark} />}>
          <Canvas
            camera={{ position: [0, 0, 6.8], fov: 42 }}
            dpr={[1, 1.75]} // Performance budget clamp
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            style={{ background: 'transparent' }}
          >
            <SceneContent isDark={isDark} />
          </Canvas>
        </Suspense>
      </div>
    </CanvasErrorBoundary>
  );
}
