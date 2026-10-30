import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

export default function ScrollMorphCanvas({ isLowTier = false }) {
  const { isDark } = useTheme();
  const groupRef = useRef();
  const servicesGroupRef = useRef();
  const processGroupRef = useRef();
  const pricingGroupRef = useRef();

  const [scrollSection, setScrollSection] = useState('hero');
  const [scrollRatio, setScrollRatio] = useState(0);

  const colors = useMemo(() => ({
    olivePrimary: '#54703F',
    deepOlive: '#425832',
    sageTint: '#94B380',
    lightSage: '#D7E3CD',
    panelBg: isDark ? '#121212' : '#f5f5f5',
    fogColor: isDark ? '#000000' : '#ffffff',
  }), [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      setScrollRatio(progress);

      const servicesEl = document.getElementById('services');
      const processEl = document.getElementById('process');
      const pricingEl = document.getElementById('pricing');

      const y = window.scrollY + window.innerHeight * 0.4;
      if (pricingEl && y >= pricingEl.offsetTop) {
        setScrollSection('pricing');
      } else if (processEl && y >= processEl.offsetTop) {
        setScrollSection('process');
      } else if (servicesEl && y >= servicesEl.offsetTop) {
        setScrollSection('services');
      } else {
        setScrollSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smoothly morph camera and group positions based on current section
    let targetY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    if (scrollSection === 'services') {
      targetY = -0.5;
      targetRotY = Math.PI * 0.25;
      targetRotX = 0.1;
    } else if (scrollSection === 'process') {
      targetY = -1.0;
      targetRotY = -Math.PI * 0.3;
      targetRotX = -0.08;
    } else if (scrollSection === 'pricing') {
      targetY = -1.4;
      targetRotY = Math.PI * 0.15;
      targetRotX = 0.12;
    }

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 2.5);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 2.5);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 2.5);

    // Dynamic rotation of service panels
    if (servicesGroupRef.current) {
      servicesGroupRef.current.rotation.y += delta * 0.2;
    }

    // Process nodes line animation
    if (processGroupRef.current) {
      processGroupRef.current.rotation.z += delta * 0.1;
    }

    // Pricing tilt
    if (pricingGroupRef.current) {
      pricingGroupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Services Stage: 3 floating panels that rotate into focus */}
      <group 
        ref={servicesGroupRef} 
        position={[2.5, -4, -3]} 
        visible={scrollSection === 'services' || scrollSection === 'hero'}
      >
        {[0, 1, 2].map((i) => {
          const angle = (i * Math.PI * 2) / 3;
          const radius = 2.0;
          return (
            <mesh 
              key={i} 
              position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[1.2, 1.8, 0.05]} />
              <meshStandardMaterial 
                color={colors.deepOlive} 
                roughness={0.3} 
                metalness={0.7} 
                opacity={0.8}
                transparent
              />
            </mesh>
          );
        })}
      </group>

      {/* Process Stage: 4 nodes connected by an animated line */}
      <group 
        ref={processGroupRef} 
        position={[-2.5, -8, -2]} 
        visible={scrollSection === 'process'}
      >
        {[
          [-1.5, 0.8, 0],
          [-0.5, -0.4, 0.3],
          [0.6, 0.5, -0.2],
          [1.6, -0.6, 0.1],
        ].map((pos, idx) => (
          <Float key={idx} speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
            <mesh position={pos}>
              <octahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial color={colors.olivePrimary} roughness={0.2} metalness={0.8} />
            </mesh>
          </Float>
        ))}
      </group>

      {/* Pricing Stage: 3 tilting 3D cards */}
      <group 
        ref={pricingGroupRef} 
        position={[0, -12, -2]} 
        visible={scrollSection === 'pricing'}
      >
        {[-1.8, 0, 1.8].map((xOffset, idx) => (
          <Float key={idx} speed={1.5} rotationIntensity={0.4} floatIntensity={0.7}>
            <mesh position={[xOffset, 0, idx === 1 ? 0.3 : 0]}>
              <boxGeometry args={[1.3, 2.0, 0.06]} />
              <meshStandardMaterial 
                color={idx === 1 ? colors.olivePrimary : colors.deepOlive} 
                roughness={0.25} 
                metalness={0.7}
              />
            </mesh>
          </Float>
        ))}
      </group>
    </group>
  );
}
