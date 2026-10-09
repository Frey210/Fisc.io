'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 3D Stylized Smartphone with Dynamic Island & Screen Glow
function Phone3D({ isHovered }: { isHovered: boolean }) {
  const phoneRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!phoneRef.current) return;
    const t = state.clock.getElapsedTime();
    // Smooth idle float + mouse tilt reaction
    const targetY = isHovered ? Math.sin(t * 1.5) * 0.15 + 0.1 : Math.sin(t * 1.2) * 0.1;
    const targetRotX = isHovered ? -0.15 : -0.1 + Math.sin(t * 0.8) * 0.05;
    const targetRotY = isHovered ? 0.35 : 0.25 + Math.cos(t * 0.8) * 0.08;

    phoneRef.current.position.y = THREE.MathUtils.lerp(phoneRef.current.position.y, targetY, 0.08);
    phoneRef.current.rotation.x = THREE.MathUtils.lerp(phoneRef.current.rotation.x, targetRotX, 0.08);
    phoneRef.current.rotation.y = THREE.MathUtils.lerp(phoneRef.current.rotation.y, targetRotY, 0.08);
  });

  return (
    <group ref={phoneRef} position={[-0.85, 0, 0]} rotation={[-0.1, 0.25, -0.05]}>
      {/* Phone Body (Matte Obsidian) */}
      <RoundedBox args={[1.7, 3.4, 0.16]} radius={0.16} smoothness={8}>
        <meshStandardMaterial
          color="#090d16"
          roughness={0.2}
          metalness={0.85}
          envMapIntensity={1.5}
        />
      </RoundedBox>

      {/* Screen Surface (Deep OLED Glass with Emerald Ambient Sheen) */}
      <mesh position={[0, 0, 0.086]}>
        <planeGeometry args={[1.56, 3.24]} />
        <meshStandardMaterial
          color="#020617"
          roughness={0.15}
          metalness={0.5}
          emissive="#064e3b"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Simulated UI Cards inside Screen (Chat Bubble Visuals) */}
      <mesh position={[0, 0.9, 0.09]}>
        <planeGeometry args={[1.3, 0.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>
      {/* Bot Chat Bubble */}
      <mesh position={[-0.25, 0.2, 0.09]}>
        <planeGeometry args={[0.9, 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>
      {/* User Chat Bubble (Emerald) */}
      <mesh position={[0.25, -0.4, 0.09]}>
        <planeGeometry args={[0.9, 0.35]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.35} />
      </mesh>

      {/* Dynamic Island Notch */}
      <mesh position={[0, 1.45, 0.092]}>
        <capsuleGeometry args={[0.04, 0.2, 8, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Edge Bumper Highlight (Subtle Emerald Metallic Accent) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.74, 3.44, 0.1]} />
        <meshBasicMaterial color="#10b981" wireframe opacity={0.15} transparent />
      </mesh>
    </group>
  );
}

// 3D Glass Dashboard Hologram Slate on Right
function DashboardSlate3D({ isHovered }: { isHovered: boolean }) {
  const slateRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!slateRef.current) return;
    const t = state.clock.getElapsedTime();
    const targetY = isHovered ? -Math.sin(t * 1.5) * 0.12 - 0.05 : -Math.sin(t * 1.0) * 0.08;
    const targetRotX = isHovered ? 0.08 : 0.05 + Math.sin(t * 0.7) * 0.03;
    const targetRotY = isHovered ? -0.32 : -0.22 - Math.cos(t * 0.7) * 0.05;

    slateRef.current.position.y = THREE.MathUtils.lerp(slateRef.current.position.y, targetY, 0.08);
    slateRef.current.rotation.x = THREE.MathUtils.lerp(slateRef.current.rotation.x, targetRotX, 0.08);
    slateRef.current.rotation.y = THREE.MathUtils.lerp(slateRef.current.rotation.y, targetRotY, 0.08);
  });

  return (
    <group ref={slateRef} position={[1.1, -0.1, -0.2]} rotation={[0.05, -0.25, 0.02]}>
      {/* Glassmorphism Chassis */}
      <RoundedBox args={[2.6, 2.0, 0.08]} radius={0.12} smoothness={8}>
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.1}
          metalness={0.1}
          transmission={0.65}
          thickness={0.5}
          transparent
          opacity={0.88}
        />
      </RoundedBox>

      {/* Screen Chart Line Glow */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[2.3, 1.7]} />
        <meshStandardMaterial
          color="#020617"
          roughness={0.2}
          emissive="#047857"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* KPI Cards */}
      <mesh position={[-0.55, 0.45, 0.05]}>
        <planeGeometry args={[0.9, 0.45]} />
        <meshStandardMaterial color="#0f172a" emissive="#10b981" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.55, 0.45, 0.05]}>
        <planeGeometry args={[0.9, 0.45]} />
        <meshStandardMaterial color="#0f172a" emissive="#38bdf8" emissiveIntensity={0.15} />
      </mesh>

      {/* Hologram Grid Bar Graph */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
        <mesh key={i} position={[x, -0.3 + (i * 0.08), 0.05]}>
          <boxGeometry args={[0.18, 0.3 + i * 0.15, 0.02]} />
          <meshStandardMaterial
            color={i >= 3 ? '#10b981' : '#334155'}
            emissive={i >= 3 ? '#10b981' : '#0f172a'}
            emissiveIntensity={i >= 3 ? 0.6 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

// Glowing Orbiting Particles (Telegram Data Sync Path)
function SyncOrbitalParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = 28;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Curve between phone [-0.85, 0, 0] and dashboard [1.1, 0, 0]
      const alpha = i / particleCount;
      const x = THREE.MathUtils.lerp(-0.85, 1.1, alpha);
      const y = Math.sin(alpha * Math.PI) * 0.5 + (Math.random() - 0.5) * 0.15;
      const z = (Math.random() - 0.5) * 0.4;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#34d399"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function Canvas3DHeroScene() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[380px] sm:h-[450px] lg:h-[500px] cursor-grab active:cursor-grabbing"
    >
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 3, 3]} intensity={1.8} color="#10b981" />
        <pointLight position={[-3, -2, 2]} intensity={1.2} color="#06b6d4" />
        <directionalLight position={[0, 4, 2]} intensity={1.5} color="#ffffff" />

        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
          <Phone3D isHovered={isHovered} />
          <DashboardSlate3D isHovered={isHovered} />
          <SyncOrbitalParticles />
        </Float>
      </Canvas>
    </div>
  );
}
