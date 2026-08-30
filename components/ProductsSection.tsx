'use client';

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useGLTF, ContactShadows, Center, shaderMaterial, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { asset } from '@/lib/asset';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

const products = [
  {
    id: 'bottle-1',
    title: 'Origin Milk Emulsion',
    supportCopy: 'Designed as 4, worn as 1.\nSerum, moisturiser, sunscreen and\nprimer in one quiet, milk-light step.',
    ingredientsLabel: 'With Beta-Glucan and\nCamellia Sinensis Extract',
    ingredientsDesc: 'For Barrier Support and\nAntioxidant Protection',
    buttonText: 'Explore Origin',
    model: asset('/1.glb'),
    color: '#D44026',
  },
  {
    id: 'bottle-2',
    title: 'Aura Pearl Skinwear',
    supportCopy: 'Formulated for skin that wants\nprotection with presence. A luminous\nexperience of everyday protection.',
    ingredientsLabel: 'With Ectoin and Bisabolol',
    ingredientsDesc: 'For Skin-Calming Protection and\nHydration Support',
    buttonText: 'Explore Aura',
    model: asset('/2.glb'),
    color: '#8A2718',
  },
];

// ─── Premium Glow Radial Shader ───
const GlowMaterial = shaderMaterial(
  { glowColor: new THREE.Color('#ffaa55'), glowOpacity: 0.8 },
  `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  `uniform vec3 glowColor; uniform float glowOpacity; varying vec2 vUv;
   void main() {
     float dist = distance(vUv, vec2(0.5));
     float alpha = smoothstep(0.5, 0.0, dist);
     alpha = pow(alpha, 1.5);
     gl_FragColor = vec4(glowColor, alpha * glowOpacity);
   }`
);

extend({ GlowMaterial });// ─── Single Bottle ───
function Bottle({
  modelPath,
  scrollProgress,
  isActive,
  scale = 0.35,
}: {
  modelPath: string;
  scrollProgress: React.MutableRefObject<number>;
  isActive: boolean;
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(modelPath);
  const cloned = React.useMemo(() => scene.clone(true), [scene]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    // Instantly hide/show the bottle when activeIndex changes
    groupRef.current.visible = isActive;
    if (!isActive) return;

    const p = scrollProgress.current;

    // Bottle rotates beautifully driven by scroll
    const scrollRotation = p * Math.PI * 2.0;
    // Plus a tiny bit of idle life
    const idleRotation = clock.elapsedTime * 0.2;
    const idleFloat = Math.sin(clock.elapsedTime * 0.6) * 0.008;

    groupRef.current.position.set(0, idleFloat, 0);
    groupRef.current.rotation.set(0, scrollRotation + idleRotation, 0);
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={cloned} />
      </Center>
    </group>
  );
}

// ─── Scene ───
function Scene({ scrollProgress, activeIndex }: { scrollProgress: React.MutableRefObject<number>; activeIndex: number }) {
  const activeColor = products[activeIndex].color;
  
  // Distinct glow colors matching the products
  const glowColors = ['#ffcc66', '#ffd9a8']; // Golden sunshine for Origin, Warm pearl for Aura (sits with the bright molten-orange dome)
  const activeGlow = glowColors[activeIndex];

  const glowRef = useRef<any>(null);
  const pointLightRef = useRef<THREE.PointLight>(null!);
  const shadowGroupRef = useRef<THREE.Group>(null!);

  useFrame(({ camera }) => {
    const p = scrollProgress.current;
    
    // Smooth fade out of central glow during the midpoint (p = 0.5) crossfade
    let visibility = 1.0;
    if (p >= 0.40 && p <= 0.60) {
      visibility = (Math.abs(p - 0.5) / 0.10); // dips to 0 at exactly 0.5
    }

    if (glowRef.current) {
      glowRef.current.glowOpacity = visibility * 0.85; 
      glowRef.current.glowColor.set(activeGlow); // Update shader glow color
    }
    
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 3.5 * visibility;
      pointLightRef.current.color.set(activeGlow);
    }
    
    if (shadowGroupRef.current) {
      shadowGroupRef.current.visible = true;
      shadowGroupRef.current.scale.setScalar(1.0); // Shadow stays stable
    }

    // Cinematic Camera Dolly
    // Restoring the "cinematic whip pan" feel by physically orbiting the camera 
    // in a smooth arc around the front of the product as the user scrolls.
    const cameraAngle = (p - 0.5) * Math.PI * 0.5; // Sweeps from -25% to +25% of a half circle (90 degrees total)
    camera.position.x = Math.sin(cameraAngle) * 5;
    camera.position.z = Math.cos(cameraAngle) * 5;
    camera.lookAt(0, 0.2, 0);
  });

  return (
    <>


      {/* ── Premium Sunshine Backlight Glow (Fixed in center) ── */}
      <Billboard position={[0, 0.3, -1.5]}>
        <mesh>
          <planeGeometry args={[10, 10]} />
          {/* @ts-ignore */}
          <glowMaterial 
            ref={glowRef}
            glowColor={new THREE.Color(activeGlow)}
            glowOpacity={0.85} 
            transparent 
            depthWrite={false} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
      </Billboard>
      {/* Pointlight directly behind bottle for sunshine rim-light */}
      <pointLight ref={pointLightRef} position={[0, 0.5, -1]} intensity={3.5} color={activeGlow} distance={5} decay={2} />

      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-4, 3, -5]} intensity={0.4} color="#ffcc88" />
      <spotLight position={[0, 10, 3]} angle={0.3} penumbra={1} intensity={2} castShadow />
      
      {/* Center Shadow */}
      <group ref={shadowGroupRef}>
        <ContactShadows position={[0, -1.2, 0]} opacity={0.35} scale={6} blur={2.5} far={4} color={activeColor} />
      </group>

      {/* Centered Bottles */}
      <Bottle modelPath={asset('/1.glb')} scrollProgress={scrollProgress} isActive={activeIndex === 0} scale={0.35} />
      <Bottle modelPath={asset('/1.glb')} scrollProgress={scrollProgress} isActive={activeIndex === 1} scale={0.42} />
    </>
  );
}

// ─── Main ───
export default function ProductsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const introTextRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const uiWrapRef = useRef<HTMLDivElement>(null);
  const bgWrapRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);
  
  const introWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  introWordsRef.current = [];
  const introString = "Two ways to wear protection";
  
  const scrollProgress = useRef(0);
  const proxyOffset = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // ── ENTRY: Top Drop — descends from above ──
      gsap.set(sectionRef.current, { clipPath: 'inset(0% 0% 100% 0%)' });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 90%',
        end: 'top top',
        scrub: true,
        animation: gsap.to(sectionRef.current, {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power2.out',
        }),
      });

      // Whip-pan Timeline
      const whipTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=600%', // 6-stage section drastically slows down scroll speed
          pin: true,
          anticipatePin: 1,
          scrub: 1.2, 
          snap: {
            snapTo: [0, 0.25, 0.75, 1.0], // Symmetrical around 0.5 so it snaps forward correctly
            duration: { min: 0.2, max: 1.0 },
            delay: 0.1,
            ease: 'power1.inOut'
          },
          onUpdate: (self) => {
            const p = self.progress;
            scrollProgress.current = p; // Global scroll progress
            
            // Phase 1: 0% - 15% (Intro Text)
            // Phase 2: 15% - 50% (Continuous Pan to Product 2)
            // Phase 3: 50% - 100% (Continuous Pan resolving on Product 2)
            
            // ── Handle Intro Text Dissolve ──
            // Text holds fully visible from 0 to 0.08, then fades out by 0.15
            let introOp = 1.0;
            if (p > 0.08) introOp = Math.max(0, 1 - ((p - 0.08) / 0.07));
            if (introTextRef.current) introTextRef.current.style.opacity = introOp.toString();

            // ── Handle Canvas & UI Fade In ──
            // Canvas waits for text to dissolve completely, then starts fading in at 0.15 (to 0.25)
            let canvasOp = 0.0;
            if (p > 0.15) canvasOp = Math.min(1, (p - 0.15) / 0.10);
            if (canvasWrapRef.current) canvasWrapRef.current.style.opacity = canvasOp.toString();
            if (uiWrapRef.current) uiWrapRef.current.style.opacity = canvasOp.toString();
            
            // Cap the animated gradient intensity at 35% so it's less distracting
            if (bgWrapRef.current) bgWrapRef.current.style.opacity = (canvasOp * 0.35).toString();
            
            // Cinematic edge vignette rides the same fade as the canvas
            if (vignetteRef.current) vignetteRef.current.style.opacity = canvasOp.toString();

            // ── Molten Bridge into CTASection ──
            // Blooms in over the last 15% of the pin so the section's bottom edge
            // lands exactly on CTASection's top gradient stop (#F2812E) — the
            // scroll-off then reads as one continuous molten surface flowing
            // through the CTA and down into the Footer's deep ember.
            const bridgeOp = p > 0.85 ? (p - 0.85) / 0.15 : 0;
            if (bridgeRef.current) bridgeRef.current.style.opacity = bridgeOp.toString();

            // ── Handle Rotation Offset ──
            proxyOffset.current = proxy.offset; 
            
            // ── Product Swap Midpoint ──
            // Instantly snap to the second product exactly at the middle!
            const newIdx = p >= 0.5 ? 1 : 0;
            setActiveIndex((prev) => (prev !== newIdx ? newIdx : prev));
            
            // ── Smooth Crossfade for UI ──
            if (uiRef.current) {
              let textOp = 1.0;
              // Fade out Product 1 UI as it approaches midpoint, fade in Product 2 UI after midpoint
              // We make this a quick crossfade between 0.45 and 0.55
              if (p >= 0.45 && p <= 0.55) {
                textOp = (Math.abs(p - 0.5) / 0.05); // drops to 0 at 0.5
              }
              // Also account for the global UI fade in at the very start
              if (p < 0.25) {
                textOp = Math.min(textOp, canvasOp);
              }
              uiRef.current.style.opacity = textOp.toString();
            }
          },
        }
      });

      const proxy = { offset: 0 };
      
      // Reveal the intro words sequentially during the first 10% of the scroll
      whipTl.to(introWordsRef.current, {
        opacity: 1,
        stagger: 0.02,
        duration: 0.10,
        ease: "none"
      }, 0);

      // Continuous cinematic pan timeline
      whipTl.to(proxy, { offset: 1.0, duration: 1.0, ease: "none" }, 0);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="products-section" ref={sectionRef} className="relative w-full h-[100svh] overflow-hidden">
      
      {/* ── Base Animated Background (Fades in with products) ── */}
      <div ref={bgWrapRef} className="absolute inset-0 z-[-1]" style={{ opacity: 0, willChange: 'opacity' }}>
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <filter id="productsTurbulence" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" numOctaves={2} seed={8} result="noise">
              <animate
                attributeName="baseFrequency"
                values="0.005 0.010;0.008 0.006;0.005 0.010"
                dur="24s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={60} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        <div className="absolute inset-0 z-0 products-mesh overflow-hidden">
          <div className="products-cloth-field">
            <div className="products-ribbon products-ribbon-1" />
            <div className="products-ribbon products-ribbon-2" />
            <div className="products-ribbon products-ribbon-3" />
            <div className="products-ribbon products-ribbon-4" />
          </div>
        </div>
      </div>

      
      {/* ── Phase 1: Intro Text ── */}
      <div 
        ref={introTextRef}
        className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
      >
        <h2 className="text-[26px] md:text-[38px] lg:text-[50px] font-thin text-white tracking-[0.05em] text-center px-4 max-w-5xl leading-tight drop-shadow-2xl font-editorial flex flex-wrap justify-center gap-x-[0.25em] gap-y-[0.15em]">
          {introString.split(" ").map((word, wordIndex) => (
            <span 
              key={`intro-${wordIndex}`} 
              ref={el => { if (el) introWordsRef.current.push(el); }} 
              className="opacity-15 inline-block"
            >
              {word}
            </span>
          ))}
        </h2>
      </div>

      {/* ── Phase 2 & 3: 3D Scene (Starts invisible) ── */}
      <div ref={canvasWrapRef} className="absolute inset-0 z-0" style={{ opacity: 0, willChange: 'opacity' }}>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0.3, 5], fov: 38 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0, alpha: true }}
        >
          <Suspense fallback={null}>
            <Scene scrollProgress={scrollProgress} activeIndex={activeIndex} />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Cinematic Edge Vignette — frames the scene like a lens, riding the
            same fade as the canvas. Transform/opacity only, GPU-cheap. ── */}
      <div
        ref={vignetteRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          opacity: 0,
          willChange: 'opacity',
          background: 'radial-gradient(ellipse at 50% 45%, transparent 52%, rgba(5,2,1,0.42) 100%)',
        }}
      />

      {/* ── Molten Bridge — bottom edge melts into CTASection's #F2812E top stop.
            Opacity is scrubbed in over the final 15% of the pin (see onUpdate). ── */}
      <div
        ref={bridgeRef}
        className="absolute bottom-0 left-0 right-0 h-[26vh] z-[15] pointer-events-none"
        style={{
          opacity: 0,
          willChange: 'opacity',
          background: 'linear-gradient(to bottom, rgba(242,129,46,0) 0%, rgba(230,106,31,0.55) 55%, #F2812E 100%)',
        }}
      />

      {/* ── UI Layer for Products (Starts invisible) ── */}
      <div ref={uiWrapRef} className="absolute inset-0 z-20 pointer-events-none" style={{ opacity: 0, willChange: 'opacity' }}>
        <div ref={uiRef} className="absolute inset-0 w-full h-full">
          {products.map((p, i) => (
            <div 
              key={p.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${activeIndex === i ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
              
              {/* Left Side (Desktop) / Top (Mobile): Support Copy */}
              <div className="absolute top-[12vh] md:top-1/2 md:-translate-y-1/2 left-1/2 md:left-[8%] lg:left-[12%] -translate-x-1/2 md:translate-x-0 w-[90%] md:w-[40%] max-w-[360px] md:max-w-[320px] text-center md:text-left">
                <div className="font-editorial text-white text-[16px] md:text-[clamp(16px,2vw,24px)] leading-[1.35] drop-shadow-md space-y-1">
                  {p.supportCopy.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>

              {/* Right Side (Desktop) / Bottom above Title (Mobile): Ingredients */}
              <div className="absolute bottom-[20vh] md:bottom-auto md:top-1/2 md:-translate-y-1/2 left-1/2 md:left-auto md:right-[8%] lg:right-[12%] -translate-x-1/2 md:translate-x-0 w-[90%] md:w-[40%] max-w-[360px] md:max-w-[320px] text-center md:text-right">
                <div className="font-editorial text-white text-[16px] md:text-[clamp(16px,2vw,24px)] leading-[1.35] drop-shadow-md space-y-1">
                  {p.ingredientsLabel.split('\n').map((line, idx) => (
                    <p key={`label-${idx}`}>{line}</p>
                  ))}
                  {p.ingredientsDesc.split('\n').map((line, idx) => (
                    <p key={`desc-${idx}`}>{line}</p>
                  ))}
                </div>
              </div>

              {/* Bottom Center: Title and Explore Button */}
              <div className="absolute bottom-[8vh] md:bottom-[10vh] left-1/2 -translate-x-1/2 text-center w-full flex flex-col items-center">
                <h1 className="font-editorial text-white text-[clamp(32px,5vw,56px)] leading-none drop-shadow-xl mb-6 whitespace-nowrap">
                  {p.title}
                </h1>
                
                <button className="px-6 py-2.5 md:px-8 md:py-3 rounded-full border border-white/30 text-white text-[clamp(10px,1.2vw,12px)] uppercase tracking-[0.2em] font-suisse hover:bg-white hover:text-black hover:scale-105 transition-all duration-300">
                  {p.buttonText}
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

useGLTF.preload(asset('/1.glb'));
