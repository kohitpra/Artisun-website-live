'use client';

/**
 * The revolving Origin bottle on the About hero.
 *
 * Lives in its own module so `three`, `@react-three/fiber` and
 * `@react-three/drei` can be code-split away from the /about entry bundle.
 * Together those three packages are ~280 kB gzipped — more than the rest of
 * the site put together — for one decorative model. Loading them on demand
 * means the page's text and layout paint without waiting on any of it.
 */

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { asset } from '@/lib/asset';

/* ── The revolving Origin bottle (same model as the home page) ── */
function OriginBottle({
  scrollRef,
  scale,
}: {
  scrollRef: React.MutableRefObject<number>;
  scale: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(asset('/1.glb'));
  const cloned = React.useMemo(() => scene.clone(true), [scene]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Idle revolve + scroll-driven spin — the product turns as you scroll.
    const idle = clock.elapsedTime * 0.35;
    const scrollSpin = scrollRef.current * Math.PI * 2.2;
    const float = Math.sin(clock.elapsedTime * 0.7) * 0.04;
    groupRef.current.rotation.set(0, idle + scrollSpin, 0);
    groupRef.current.position.set(0, float, 0);
  });

  return (
    <group ref={groupRef} scale={scale}>
      <Center>
        <primitive object={cloned} />
      </Center>
    </group>
  );
}

function HeroScene({
  scrollRef,
  scale,
}: {
  scrollRef: React.MutableRefObject<number>;
  scale: number;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.9} />
      <directionalLight position={[-4, 3, -5]} intensity={0.55} color="#ffcc88" />
      <pointLight position={[0, 1, -2.2]} intensity={3.4} color="#ffcc66" distance={14} decay={2} />
      <spotLight position={[0, 10, 4]} angle={0.34} penumbra={1} intensity={2.4} />
      <pointLight position={[3, -1, 3]} intensity={1.2} color="#ff8a4d" distance={12} decay={2} />
      <Suspense fallback={null}>
        <OriginBottle scrollRef={scrollRef} scale={scale} />
      </Suspense>
    </>
  );
}


export default function AboutHeroScene({
  scrollRef,
  scale,
}: {
  scrollRef: React.MutableRefObject<number>;
  scale: number;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 36 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.02,
        alpha: true,
      }}
    >
      <HeroScene scrollRef={scrollRef} scale={scale} />
    </Canvas>
  );
}

useGLTF.preload(asset('/1.glb'));
