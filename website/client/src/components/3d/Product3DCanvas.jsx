import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// Procedurally generate a stylized QueFlow CRM dashboard texture
function useQueFlowTexture(isDark) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = isDark ? '#0F120E' : '#F8FAF6';
    ctx.fillRect(0, 0, 1024, 640);

    // Top Header Bar
    ctx.fillStyle = isDark ? '#161F11' : '#EBF1E6';
    ctx.fillRect(0, 0, 1024, 52);

    // Window controls (traffic lights)
    ctx.fillStyle = '#EF4444';
    ctx.beginPath(); ctx.arc(24, 26, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath(); ctx.arc(44, 26, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#10B981';
    ctx.beginPath(); ctx.arc(64, 26, 6, 0, Math.PI * 2); ctx.fill();

    // App Title
    ctx.fillStyle = isDark ? '#FFFFFF' : '#1E2917';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('QueFlow CRM — Dashboard', 90, 32);

    // Sidebar
    ctx.fillStyle = isDark ? '#141A11' : '#F1F5ED';
    ctx.fillRect(0, 52, 200, 588);

    // Sidebar items
    const sideItems = ['Overview', 'Leads (Active)', 'Contacts', 'Deals Pipeline', 'Follow-ups', 'Reports'];
    sideItems.forEach((item, idx) => {
      if (idx === 1) {
        ctx.fillStyle = isDark ? '#54703F' : '#6C8C54';
        ctx.fillRect(16, 76 + idx * 38, 168, 30);
        ctx.fillStyle = '#FFFFFF';
      } else {
        ctx.fillStyle = isDark ? '#888888' : '#555555';
      }
      ctx.font = '13px sans-serif';
      ctx.fillText(item, 32, 96 + idx * 38);
    });

    // Content: 3 KPI Cards
    const cards = [
      { label: 'Active Leads', val: '248', change: '+14% this week' },
      { label: 'Pipeline Value', val: '₹ 8.4L', change: '8 Qualified' },
      { label: 'Follow-ups Due', val: '18', change: '4 Priority today' },
    ];
    cards.forEach((c, idx) => {
      const x = 224 + idx * 256;
      ctx.fillStyle = isDark ? '#1C2417' : '#FFFFFF';
      ctx.strokeStyle = isDark ? '#2D3A24' : '#E2EADA';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x, 76, 236, 92, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isDark ? '#AAAAAA' : '#666666';
      ctx.font = '12px sans-serif';
      ctx.fillText(c.label, x + 16, 102);

      ctx.fillStyle = isDark ? '#FFFFFF' : '#1E2917';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(c.val, x + 16, 134);

      ctx.fillStyle = '#54703F';
      ctx.font = '11px sans-serif';
      ctx.fillText(c.change, x + 16, 154);
    });

    // Pipeline Kanban Board Header
    ctx.fillStyle = isDark ? '#FFFFFF' : '#1E2917';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('Deal Pipeline Stages', 224, 202);

    // 3 Kanban Columns
    const stages = [
      { name: 'New Inquiries (12)', color: '#6C8C54' },
      { name: 'Demo & Pitch (6)', color: '#54703F' },
      { name: 'Won / Onboarding (8)', color: '#425832' },
    ];
    stages.forEach((st, idx) => {
      const colX = 224 + idx * 256;
      ctx.fillStyle = isDark ? '#161D12' : '#F2F6EF';
      ctx.beginPath();
      ctx.roundRect(colX, 220, 236, 390, 8);
      ctx.fill();

      // Column Header
      ctx.fillStyle = isDark ? '#DDDDDD' : '#333333';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(st.name, colX + 16, 244);

      // 3 Mock Deal Cards per column
      for (let i = 0; i < 3; i++) {
        const itemY = 260 + i * 105;
        ctx.fillStyle = isDark ? '#222C1D' : '#FFFFFF';
        ctx.strokeStyle = isDark ? '#33422A' : '#E0E7DC';
        ctx.beginPath();
        ctx.roundRect(colX + 10, itemY, 216, 90, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? '#FFFFFF' : '#1E2917';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`Business Inquiry #${1024 + idx * 5 + i}`, colX + 22, itemY + 24);

        ctx.fillStyle = isDark ? '#AAAAAA' : '#666666';
        ctx.font = '11px sans-serif';
        ctx.fillText('Scheduled call follow-up', colX + 22, itemY + 44);

        ctx.fillStyle = '#54703F';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('QueFlow SaaS', colX + 22, itemY + 70);
      }
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [isDark]);
}

function ProductScene({ isDark }) {
  const meshRef = useRef();
  const texture = useQueFlowTexture(isDark);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Gentle hovering sway
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.08 + 0.12;
    meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.05 + 0.06;
  });

  return (
    <group position={[0, 0, 0]} rotation={[0.08, -0.15, 0]}>
      <ambientLight intensity={isDark ? 0.7 : 1.1} />
      <directionalLight position={[4, 6, 4]} intensity={1.2} />

      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
        <group ref={meshRef}>
          {/* Main 3D Laptop / Dashboard Screen Frame */}
          <RoundedBox args={[4.6, 2.9, 0.14]} radius={0.06} smoothness={4} castShadow>
            <meshStandardMaterial
              color={isDark ? '#1C2417' : '#DCE5D5'}
              roughness={0.25}
              metalness={0.4}
            />
          </RoundedBox>

          {/* Front Display Screen Plane with QueFlow UI Texture */}
          <mesh position={[0, 0, 0.076]}>
            <planeGeometry args={[4.45, 2.75]} />
            <meshBasicMaterial map={texture} />
          </mesh>
        </group>
      </Float>

      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={isDark ? 0.4 : 0.25}
        scale={6}
        blur={2}
        far={3}
        color={isDark ? '#000000' : '#425832'}
      />
    </group>
  );
}

// 2D Static Poster Fallback for QueFlow
export function ProductPosterFallback({ isDark }) {
  return (
    <div className="w-full h-full min-h-[340px] flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
            <span className="ml-2 text-xs font-bold text-text">QueFlow CRM</span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
            Live SaaS Product
          </span>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-elevated border border-border">
              <div className="text-[10px] text-text opacity-70">Leads Active</div>
              <div className="text-base font-bold text-text">248</div>
            </div>
            <div className="p-2.5 rounded-lg bg-elevated border border-border">
              <div className="text-[10px] text-text opacity-70">Follow-ups Due</div>
              <div className="text-base font-bold text-text">18</div>
            </div>
            <div className="p-2.5 rounded-lg bg-elevated border border-border">
              <div className="text-[10px] text-text opacity-70">Pipeline Value</div>
              <div className="text-base font-bold text-text">₹8.4L</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-elevated border border-border text-xs text-text space-y-1">
            <div className="font-semibold text-brand">Multi-Tenant Lead & Customer Tracking</div>
            <div className="text-[11px] opacity-80">Full contact histories, deal progression, and team activity analytics.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Product3DCanvas() {
  const { isDark } = useTheme();
  const [shouldRender3D, setShouldRender3D] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLowTier = 
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
      (navigator.connection && navigator.connection.saveData);

    if (prefersReducedMotion || isLowTier) {
      setShouldRender3D(false);
    }
  }, []);

  if (!shouldRender3D) {
    return <ProductPosterFallback isDark={isDark} />;
  }

  return (
    <div className="relative w-full h-[340px] sm:h-[400px] lg:h-[450px] select-none" aria-hidden="true">
      <Suspense fallback={<ProductPosterFallback isDark={isDark} />}>
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 42 }}
          dpr={[1, 1.75]}
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent' }}
        >
          <ProductScene isDark={isDark} />
        </Canvas>
      </Suspense>
    </div>
  );
}
