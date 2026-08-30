'use client';

import { useEffect, useRef } from 'react';
import GlobalHeader from '../../components/GlobalHeader';
import Footer from '../../components/Footer';
import CustomCursor from '../../components/CustomCursor';
import ScrollProgressBar from '../../components/ScrollProgressBar';

// 1. ClimateHero Component Import
import ClimateHero from '../../components/climate/ClimateHero';
import ClimateBuildForWeather from '../../components/climate/ClimateBuildForWeather';
import ClimatePartOfSkincare from '../../components/climate/ClimatePartOfSkincare';
import ClimateStats from '../../components/climate/ClimateStats';
import ClimateRoutineGallery from '../../components/climate/ClimateRoutineGallery';
import ClimateCTA from '../../components/climate/ClimateCTA';

export default function ClimatePage() {
    const mouseProxy = useRef({ x: 0, y: 0, px: 0, py: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseProxy.current.px = e.clientX;
            mouseProxy.current.py = e.clientY;
            mouseProxy.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseProxy.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <main className="relative w-full min-h-[100svh] overflow-clip">
            {/* Mood: Red Eclipse — fixed so it holds all the way down the page */}
            <div className="artisun-bg" aria-hidden />
            {/* Scroll Progress Bar */}
            <ScrollProgressBar />

            {/* Cursor & Header */}
            <CustomCursor mouseProxy={mouseProxy} />
            <GlobalHeader />

            {/* SECTION 1: Climate Hero Widget */}
            <ClimateHero />

            {/* SECTION 2 */}
            <ClimateBuildForWeather />

            {/* SECTION 4 */}
            <ClimatePartOfSkincare />

            {/* SECTION 5 */}
            <ClimateStats />

            {/* SECTION 6 */}
            <ClimateRoutineGallery />

            {/* SECTION 7 */}
            <ClimateCTA />

            {/* Footer */}
            <Footer />
        </main>
    );
}