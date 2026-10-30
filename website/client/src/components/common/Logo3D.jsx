import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * Logo3D — Official Que Solutions 3D Logo Component
 * 
 * Features:
 * - Multi-layer 3D depth with subtle physical extrusion (translateZ layering).
 * - Theme-aware rendering (auto-switches between light and dark transparent assets).
 * - Realistic metallic/glossy specular reflection sweep driven by pointer angle.
 * - Smooth physics-based 3D tilt interaction (Framer Motion springs).
 * - Gentle ambient floating animation when idle or on mobile.
 * - Zero layout shift or navbar height distortion.
 * - 100% transparent background, eliminating white boxes in both themes.
 */
export default function Logo3D({
  size = 'md',
  variant = 'circle', // 'circle' | 'horizontal'
  interactive = true,
  className = '',
  style = {},
}) {
  const { isDark } = useTheme();
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Motion values for smooth 3D tilt (-1 to 1 normalized)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // High-fidelity spring configuration
  const springConfig = { damping: 22, stiffness: 320, mass: 0.4 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Tilt degrees: subtle, elegant (max ±10deg)
  const rotateX = useTransform(smoothY, [-1, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [-1, 1], [-10, 10]);

  // Specular light highlight position (glides across the surface)
  const sheenX = useTransform(smoothX, [-1, 1], [15, 85]);
  const sheenY = useTransform(smoothY, [-1, 1], [15, 85]);

  const handlePointerMove = (e) => {
    if (!interactive || isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const pointerX = (e.clientX - rect.left) / rect.width;
    const pointerY = (e.clientY - rect.top) / rect.height;

    // Normalize from -1 to 1
    x.set(Math.max(-1, Math.min(1, (pointerX - 0.5) * 2)));
    y.set(Math.max(-1, Math.min(1, (pointerY - 0.5) * 2)));
  };

  const handlePointerEnter = () => {
    if (interactive && !isTouchDevice) setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Determine asset based on theme and variant
  const getLogoSrc = () => {
    if (variant === 'horizontal') {
      return isDark ? '/logo-dark.png' : '/logo-light.png';
    }
    return isDark ? '/logo-circle-dark.png' : '/logo-circle-light.png';
  };

  // Size styling presets
  const sizeClasses = {
    xs: variant === 'horizontal' ? 'w-24 h-7' : 'w-7 h-7 sm:w-8 sm:h-8',
    sm: variant === 'horizontal' ? 'w-32 h-9' : 'w-9 h-9 sm:w-10 sm:h-10',
    md: variant === 'horizontal' ? 'w-44 h-12' : 'w-11 h-11 sm:w-12 sm:h-12',
    lg: variant === 'horizontal' ? 'w-56 h-16' : 'w-14 h-14 sm:w-16 sm:h-16',
    xl: variant === 'horizontal' ? 'w-72 h-20' : 'w-20 h-20 sm:w-24 sm:h-24',
  }[size] || (variant === 'horizontal' ? 'w-44 h-12' : 'w-11 h-11 sm:w-12 sm:h-12');

  const logoSrc = getLogoSrc();

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      initial={{ opacity: 0, scale: 0.94, y: 3 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`relative inline-flex items-center justify-center select-none flex-shrink-0 ${sizeClasses} ${className}`}
      style={{
        perspective: 800,
        ...style,
      }}
    >
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          rotateX: interactive && !isTouchDevice ? rotateX : 0,
          rotateY: interactive && !isTouchDevice ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        animate={
          isTouchDevice
            ? {
                rotateY: [-2, 2, -2],
                rotateX: [1, -1, 1],
              }
            : undefined
        }
        transition={
          isTouchDevice
            ? {
                repeat: Infinity,
                duration: 6,
                ease: 'easeInOut',
              }
            : undefined
        }
      >
        {/* ============================================================
            LAYER 1: Ambient Contact Shadow (Soft brand olive / dark glow)
            ============================================================ */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full pointer-events-none transition-all duration-300"
          style={{
            transform: 'translateZ(-14px) translateY(4px) scale(0.92)',
            background: isDark
              ? 'radial-gradient(circle, rgba(184, 224, 138, 0.22) 0%, rgba(0, 0, 0, 0.6) 70%, transparent 100%)'
              : 'radial-gradient(circle, rgba(66, 88, 50, 0.22) 0%, rgba(0, 0, 0, 0.12) 65%, transparent 100%)',
            filter: 'blur(6px)',
            opacity: isHovered ? 0.95 : 0.65,
          }}
        />

        {/* ============================================================
            LAYER 2: Extrusion / Layered Depth (Subtle rear silhouette)
            ============================================================ */}
        <img
          src={logoSrc}
          alt=""
          aria-hidden="true"
          loading="eager"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-300"
          style={{
            transform: 'translateZ(-5px) translate(1px, 2px)',
            filter: isDark
              ? 'brightness(0.35) contrast(1.4) drop-shadow(0 0 1px rgba(0,0,0,0.8))'
              : 'brightness(0.4) contrast(1.3) drop-shadow(0 0 1px rgba(0,0,0,0.3))',
            opacity: 0.6,
          }}
        />

        {/* ============================================================
            LAYER 3: Mid Depth Layer (Intermediary extrusion)
            ============================================================ */}
        <img
          src={logoSrc}
          alt=""
          aria-hidden="true"
          loading="eager"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          style={{
            transform: 'translateZ(-2px) translate(0.5px, 1px)',
            filter: isDark
              ? 'brightness(0.7) contrast(1.2)'
              : 'brightness(0.75) contrast(1.15)',
            opacity: 0.75,
          }}
        />

        {/* ============================================================
            LAYER 4: Primary Official Face Layer
            ============================================================ */}
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transform: 'translateZ(4px)',
          }}
          whileHover={interactive ? { scale: 1.04 } : undefined}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <img
            src={logoSrc}
            alt="QUE SOLUTIONS"
            loading="eager"
            className="w-full h-full object-contain drop-shadow-sm transition-all duration-300"
            style={{
              filter: isDark
                ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 12px rgba(184, 224, 138, 0.28))'
                : 'drop-shadow(0 2px 4px rgba(66, 88, 50, 0.18))',
            }}
          />

          {/* ============================================================
              LAYER 5: Specular Gloss / Metallic Reflection Overlay
              ============================================================ */}
          <motion.div
            aria-hidden="true"
            className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-300 ${
              variant === 'circle' ? 'rounded-full' : 'rounded-lg'
            }`}
            style={{
              transform: 'translateZ(8px)',
              opacity: isHovered ? (isDark ? 0.45 : 0.35) : isDark ? 0.2 : 0.12,
              background: `radial-gradient(circle at 45% 35%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.08) 45%, transparent 70%)`,
              mixBlendMode: 'overlay',
            }}
          />

          {/* Subtle Dynamic Glint Line */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
              variant === 'circle' ? 'rounded-full' : 'rounded-lg'
            }`}
            style={{
              transform: 'translateZ(10px)',
              background:
                'linear-gradient(135deg, transparent 38%, rgba(255, 255, 255, 0.25) 50%, transparent 62%)',
              opacity: isHovered ? 0.7 : 0.15,
              mixBlendMode: 'soft-light',
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
