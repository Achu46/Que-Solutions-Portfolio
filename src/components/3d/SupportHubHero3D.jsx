import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

export default function SupportHubHero3D({ isLowTier = false }) {
  const { isDark } = useTheme();
  const { mouse } = useThree();

  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const centralIcosaRef = useRef();

  // Color tokens from brand palette
  const colors = useMemo(() => ({
    olivePrimary: '#54703F',
    deepOlive: '#425832',
    darkOlive: '#2C3B22',
    sageTint: '#94B380',
    lightSage: '#D7E3CD',
    fogColor: isDark ? '#000000' : '#ffffff',
  }), [isDark]);

  // Procedural geometries & materials
  const materialProps = useMemo(() => {
    return {
      color: colors.olivePrimary,
      roughness: 0.2,
      metalness: 0.6,
      clearcoat: isLowTier ? 0 : 0.8,
      clearcoatRoughness: 0.1,
    };
  }, [colors, isLowTier]);

  useFrame((state, delta) => {
    // Subtle continuous rotations
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.15;
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.12;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.08;
    if (centralIcosaRef.current) {
      centralIcosaRef.current.rotation.y += delta * 0.2;
      centralIcosaRef.current.rotation.x += delta * 0.1;
    }

    // Mouse parallax (damped max 0.5 units)
    if (groupRef.current) {
      const targetX = (mouse.x * 0.4);
      const targetY = (mouse.y * 0.3);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.05);
    }
  });

  return (
    <>
      {/* Lighting tailored to theme */}
      <ambientLight intensity={isDark ? 0.7 : 1.2} />
      <directionalLight position={[10, 10, 5]} intensity={isDark ? 1.5 : 2.0} color="#ffffff" />
      <directionalLight position={[-10, -5, -5]} intensity={0.5} color={colors.sageTint} />
      <pointLight position={[0, 0, 3]} intensity={1.2} color={colors.olivePrimary} distance={8} />

      {/* Subtle depth fog */}
      <fog attach="fog" args={[colors.fogColor, 6, 20]} />

      <group ref={groupRef} position={[1.2, 0, 0]}>
        {/* Central Olive Glass / Metal Icosahedron */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
          <mesh ref={centralIcosaRef} position={[0, 0, 0]}>
            <icosahedronGeometry args={[1.3, 1]} />
            <meshPhysicalMaterial {...materialProps} />
          </mesh>
        </Float>

        {/* Orbiting Ring 1 */}
        <group ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
          <mesh>
            <torusGeometry args={[2.2, 0.025, 16, 64]} />
            <meshStandardMaterial color={colors.sageTint} roughness={0.3} metalness={0.8} />
          </mesh>
        </group>

        {/* Orbiting Ring 2 */}
        <group ref={ring2Ref} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
          <mesh>
            <torusGeometry args={[2.7, 0.02, 16, 64]} />
            <meshStandardMaterial color={colors.deepOlive} roughness={0.4} metalness={0.6} />
          </mesh>
        </group>

        {/* Orbiting Ring 3 */}
        <group ref={ring3Ref} rotation={[Math.PI / 6, -Math.PI / 4, 0]}>
          <mesh>
            <torusGeometry args={[3.2, 0.015, 16, 64]} />
            <meshStandardMaterial color={colors.olivePrimary} roughness={0.5} metalness={0.5} />
          </mesh>
        </group>

        {/* Floating Support Hub Shape 1: Headset arch + earcups */}
        <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.2}>
          <group position={[-2.4, 1.2, 0.5]} scale={0.5}>
            {/* Arch */}
            <mesh rotation={[0, 0, 0]}>
              <torusGeometry args={[0.7, 0.07, 16, 32, Math.PI]} />
              <meshStandardMaterial color={colors.olivePrimary} roughness={0.3} metalness={0.7} />
            </mesh>
            {/* Left earcup */}
            <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
              <meshStandardMaterial color={colors.sageTint} roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Right earcup */}
            <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
              <meshStandardMaterial color={colors.sageTint} roughness={0.2} metalness={0.8} />
            </mesh>
          </group>
        </Float>

        {/* Floating Support Hub Shape 2: Chat Bubble */}
        <Float speed={2.2} rotationIntensity={0.9} floatIntensity={1.5}>
          <group position={[2.2, 1.5, -0.5]} scale={0.45}>
            <mesh>
              <sphereGeometry args={[0.7, 24, 24]} />
              <meshStandardMaterial color={colors.deepOlive} roughness={0.3} metalness={0.5} />
            </mesh>
            {/* Small tail cone */}
            <mesh position={[-0.4, -0.6, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <coneGeometry args={[0.25, 0.5, 16]} />
              <meshStandardMaterial color={colors.deepOlive} roughness={0.3} metalness={0.5} />
            </mesh>
          </group>
        </Float>

        {/* Floating Support Hub Shape 3: Phone Handset Silhouette */}
        <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.1}>
          <group position={[-1.8, -1.8, 0.8]} scale={0.4} rotation={[0, 0.3, -0.4]}>
            <mesh>
              <boxGeometry args={[0.5, 1.2, 0.12]} />
              <meshStandardMaterial color={colors.olivePrimary} roughness={0.2} metalness={0.7} />
            </mesh>
            <mesh position={[0, 0, 0.08]}>
              <boxGeometry args={[0.4, 0.9, 0.02]} />
              <meshStandardMaterial color={colors.lightSage} roughness={0.4} metalness={0.2} />
            </mesh>
          </group>
        </Float>

        {/* Floating Support Hub Shape 4: Message Icon Envelope */}
        <Float speed={2.5} rotationIntensity={0.7} floatIntensity={1.3}>
          <group position={[2.4, -1.3, 0.2]} scale={0.4} rotation={[0.2, -0.3, 0.2]}>
            <mesh>
              <boxGeometry args={[1.2, 0.8, 0.1]} />
              <meshStandardMaterial color={colors.sageTint} roughness={0.3} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.1, 0.06]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.6, 0.6, 0.02]} />
              <meshStandardMaterial color={colors.olivePrimary} roughness={0.2} metalness={0.5} />
            </mesh>
          </group>
        </Float>

        {/* Floating Micro Nodes / Particles */}
        {!isLowTier && [
          [1.5, 2.3, 0.8],
          [-1.2, 2.5, -0.6],
          [2.8, 0.2, 1.2],
          [-2.6, 0.1, -1.2],
          [-1.5, -2.4, -0.4],
          [1.8, -2.2, -1.1],
        ].map((pos, i) => (
          <Float key={i} speed={1.5 + (i * 0.2)} rotationIntensity={0.4} floatIntensity={0.9}>
            <mesh position={pos}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color={colors.sageTint} emissive={colors.olivePrimary} emissiveIntensity={0.4} />
            </mesh>
          </Float>
        ))}
      </group>
    </>
  );
}
