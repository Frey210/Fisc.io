'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { demoTransactions } from './hero-interactive-setup';

type SceneProps = { selected: number; expanded: boolean; paused: boolean; reset: number; onSelect: () => void };

function useScreenTexture(selected: number, dashboard: boolean) {
  const [fontReady, setFontReady] = useState(false);
  useEffect(() => { let active = true; document.fonts.ready.then(() => { if (active) setFontReady(true); }); return () => { active = false; }; }, []);
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = dashboard ? 1000 : 600;
    canvas.height = dashboard ? 700 : 1100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const item = demoTransactions[selected];
    ctx.fillStyle = '#f6f5ee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const text = (value: string, x: number, y: number, size: number, color = '#173d32', weight = 600) => {
      ctx.fillStyle = color; ctx.font = `${weight} ${size}px Manrope, sans-serif`; ctx.fillText(value, x, y);
    };
    const rect = (x: number, y: number, w: number, h: number, color: string, radius = 20) => {
      ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fill();
    };
    if (dashboard) {
      rect(0, 0, 1000, 72, '#173d32', 0);
      text('fisc.io', 38, 48, 32, '#f6f5ee', 800);
      text('Ringkasan keuangan', 40, 138, 32);
      text('TRANSAKSI TERBARU', 40, 208, 20, '#52695e');
      text(item.amount, 40, 266, 52, '#173d32', 800);
      text(`${item.type} / ${item.account}`, 42, 310, 24, '#52695e');
      text('Arus kas', 42, 382, 27);
      text('Data contoh', 790, 382, 20, '#52695e');
      ctx.strokeStyle = '#c8d8c7'; ctx.lineWidth = 2;
      [440, 510, 580].forEach(y => { ctx.beginPath(); ctx.moveTo(44, y); ctx.lineTo(950, y); ctx.stroke(); });
      item.bars.forEach((height, i) => rect(70 + i * 175, 580 - height * 145, 104, height * 145, i === 4 ? '#173d32' : '#a7c9ad', 8));
      ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'].forEach((day, i) => text(day, 100 + i * 175, 623, 22, '#52695e'));
      text('Catatan Anda, dalam satu pandangan.', 42, 675, 20, '#52695e');
    } else {
      rect(0, 0, 600, 190, '#173d32', 0);
      text('9:41', 35, 48, 21, '#f6f5ee');
      text('Fisc.io Bot', 40, 125, 38, '#f6f5ee', 800);
      text('Telegram', 40, 160, 22, '#c6dac9');
      text('Hari ini', 250, 246, 22, '#52695e');
      rect(72, 305, 492, 160, '#d8eabd');
      text(item.message.startsWith('+') ? '+8500000 gaji' : item.message.replace(/ (gopay|bca)$/, ''), 100, 364, 27);
      text(item.message.startsWith('+') ? 'freelance' : item.account.toLowerCase(), 100, 410, 27);
      rect(28, 505, 516, 230, '#ffffff');
      text('Transaksi tercatat', 55, 560, 28);
      text(item.amount, 55, 620, 38, '#173d32', 800);
      text(item.category, 55, 669, 24, '#52695e');
      text(item.account, 55, 708, 24, '#52695e');
      text('Data contoh', 35, 845, 22, '#52695e');
      rect(25, 944, 550, 82, '#e4e9df');
      text('Ketik transaksi…', 55, 995, 27, '#52695e');
      rect(210, 1060, 180, 9, '#173d32', 4);
    }
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = 4;
    return result;
  }, [selected, dashboard, fontReady]);
  useEffect(() => () => texture?.dispose(), [texture]);
  return texture;
}

function Devices({ selected, expanded, paused, onSelect }: Omit<SceneProps, 'reset'>) {
  const viewport = useThree(state => state.viewport);
  const phone = useRef<THREE.Group>(null);
  const dashboard = useRef<THREE.Group>(null);
  const time = useRef(0);
  const phoneTexture = useScreenTexture(selected, false);
  const dashboardTexture = useScreenTexture(selected, true);
  useFrame((_, delta) => {
    if (!phone.current || !dashboard.current) return;
    if (!paused) time.current += Math.min(delta, 0.05);
    const float = paused ? 0 : Math.sin(time.current * 0.85) * 0.055;
    const damp = (value: number, target: number) => paused ? target : THREE.MathUtils.damp(value, target, 7, delta);
    phone.current.position.x = damp(phone.current.position.x, expanded ? -1.65 : -1.02);
    phone.current.position.y = damp(phone.current.position.y, 0.02 + float);
    phone.current.rotation.z = damp(phone.current.rotation.z, expanded ? -0.16 : -0.09);
    dashboard.current.position.x = damp(dashboard.current.position.x, expanded ? 1.15 : 0.8);
    dashboard.current.position.y = damp(dashboard.current.position.y, 0.16 - float);
  });
  return (
    <group scale={Math.min(1.3, viewport.width / 5.8)} onClick={event => { event.stopPropagation(); onSelect(); }}>
      <group ref={dashboard} name="dashboard" position={[0.8, 0.16, -0.55]} rotation={[0, -0.12, 0.035]}>
        <RoundedBox args={[3.1, 2.28, 0.16]} radius={0.1} smoothness={4}><meshStandardMaterial color="#49705a" roughness={0.38} metalness={0.35} /></RoundedBox>
        <mesh position={[0, 0, 0.085]}><planeGeometry args={[2.94, 2.06]} /><meshBasicMaterial map={dashboardTexture} /></mesh>
        <mesh position={[0, -1.43, -0.1]}><cylinderGeometry args={[0.07, 0.09, 0.6, 16]} /><meshStandardMaterial color="#49705a" roughness={0.4} metalness={0.4} /></mesh>
        <RoundedBox position={[0, -1.7, 0]} args={[1.1, 0.08, 0.6]} radius={0.035} smoothness={4}><meshStandardMaterial color="#49705a" roughness={0.4} metalness={0.4} /></RoundedBox>
      </group>
      <group ref={phone} name="phone" position={[-1.02, 0.02, 0.65]} rotation={[-0.06, 0.12, -0.09]}>
        <RoundedBox args={[1.46, 2.82, 0.2]} radius={0.17} smoothness={4}><meshStandardMaterial color="#183e33" roughness={0.32} metalness={0.4} /></RoundedBox>
        <RoundedBox position={[0, 0, 0.106]} args={[1.3, 2.62, 0.012]} radius={0.105} smoothness={4}><meshBasicMaterial color="#f6f5ee" /></RoundedBox>
        <mesh position={[0, 0, 0.12]}><planeGeometry args={[1.22, 2.49]} /><meshBasicMaterial map={phoneTexture} /></mesh>
        <RoundedBox position={[0, 1.15, 0.132]} args={[0.38, 0.072, 0.025]} radius={0.03} smoothness={4}><meshBasicMaterial color="#102b24" /></RoundedBox>
        <RoundedBox position={[-0.742, 0.48, 0]} args={[0.03, 0.25, 0.09]} radius={0.01}><meshStandardMaterial color="#759080" metalness={0.5} roughness={0.3} /></RoundedBox>
        <RoundedBox position={[-0.742, 0.08, 0]} args={[0.03, 0.25, 0.09]} radius={0.01}><meshStandardMaterial color="#759080" metalness={0.5} roughness={0.3} /></RoundedBox>
      </group>
      <mesh position={[0.15, -1.79, -0.1]}><cylinderGeometry args={[2.45, 2.45, 0.08, 64]} /><meshStandardMaterial color="#b6cfb0" roughness={0.85} /></mesh>
    </group>
  );
}

export function Canvas3DHeroScene(props: SceneProps) {
  return (
    <Canvas camera={{ position: [0, 0.7, 7.4], fov: 39 }} dpr={[1, 1.5]} frameloop={props.paused ? 'demand' : 'always'} gl={{ antialias: true, alpha: true }} fallback={<div className="scene-placeholder">Perangkat ini tidak mendukung 3D. Coba contoh transaksi di bawah.</div>}>
      <ambientLight intensity={1.8} />
      <directionalLight position={[3, 5, 5]} intensity={3} color="#fff5df" />
      <directionalLight position={[-4, 2, 0]} intensity={2} color="#d2ecc9" />
      <Devices {...props} />
      <CameraControls reset={props.reset} paused={props.paused} />
    </Canvas>
  );
}

function CameraControls({ reset, paused }: Pick<SceneProps, 'reset' | 'paused'>) {
  const { camera, invalidate } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.7, 7.4);
    camera.lookAt(0, -0.05, 0);
    invalidate();
  }, [camera, invalidate, reset]);
  return <OrbitControls key={reset} makeDefault enableZoom={false} enablePan={false} enableDamping={!paused} minAzimuthAngle={-0.55} maxAzimuthAngle={0.55} minPolarAngle={1.12} maxPolarAngle={1.75} target={[0, -0.05, 0]} />;
}
