'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import Image from 'next/image';
import { asset } from '@/lib/asset';
import AddToBagButton from '@/components/cart/AddToBagButton';

type WeatherBand = 'WET' | 'COLD' | 'DRY_HEAT' | 'HUMID_HEAT' | 'HIGH_SUN' | 'MILD';

interface WeatherData {
  city: string;
  temp: number;
  humidity: number;
  currentUV: number;   // live UV right now (daytime display)
  peakUV: number;       // today's daily max UV (night display + classification)
  isDay: boolean;       // Open-Meteo current.is_day flag
  precip: boolean;
  band: WeatherBand;
}

interface BandDetails {
  readLine: string;
  originPumps: string;
  auraPearls: string;
  reapplyLine: string;
  leadProduct: 'Aura' | 'Origin';
}

interface BandVisual {
  sunx: string;
  suny: string;
  skyWash: string;
}

const BAND_CONFIGS: Record<WeatherBand, BandDetails> = {
  HUMID_HEAT: {
    readLine: 'Sticky and hot out. You want light, not layers, today.',
    originPumps: '2 pumps',
    auraPearls: '2 pearls - light and fresh, melts right in',
    reapplyLine: 'Top up every 2 hours - the sweat eats it faster today.',
    leadProduct: 'Aura',
  },
  DRY_HEAT: {
    readLine: 'Dry heat and strong sun. Your skin will drink this up.',
    originPumps: '2-3 pumps - go for 3 if your skin feels tight',
    auraPearls: '2 pearls - and Origin underneath if you want the extra moisture',
    reapplyLine: 'Reapply every 2 hours - high sun, low mercy.',
    leadProduct: 'Origin',
  },
  HIGH_SUN: {
    readLine: "Bright out. The UV is doing the most today, even if it doesn't feel like it.",
    originPumps: '2 pumps',
    auraPearls: '2 pearls - even, light coverage',
    reapplyLine: "This is a reapply day — every 2 hours if you're out.",
    leadProduct: 'Aura',
  },
  COLD: {
    readLine: 'Cold and dry. Your skin wants a little more today.',
    originPumps: '3 pumps - a touch more to keep skin from going tight',
    auraPearls: '3 pearls - more nourishment for the dry cold',
    reapplyLine: "Every 3 hours is fine - the sun's gentler now.",
    leadProduct: 'Origin',
  },
  WET: {
    readLine: 'Damp and humid. A little goes a long way right now.',
    originPumps: '2 pumps',
    auraPearls: '1-2 pearls - light, and it holds through the damp',
    reapplyLine: 'After you get caught in the rain, or every 2-3 hours out.',
    leadProduct: 'Aura',
  },
  MILD: {
    readLine: "Easy weather today but the sun's still on. Don't skip it.",
    originPumps: '2 pumps',
    auraPearls: '2 pearls - your everyday amount',
    reapplyLine: "Every 2-3 hours if you're out for long.",
    leadProduct: 'Aura',
  },
};

// ── Step 5: Visual state per band ──
const BAND_VISUALS: Record<WeatherBand, BandVisual> = {
  HUMID_HEAT: { sunx: '78%', suny: '14%', skyWash: 'rgba(255,175,90,.5)' },
  DRY_HEAT: { sunx: '60%', suny: '8%', skyWash: 'rgba(255,150,70,.6)' },
  HIGH_SUN: { sunx: '68%', suny: '10%', skyWash: 'rgba(255,190,120,.5)' },
  COLD: { sunx: '30%', suny: '22%', skyWash: 'rgba(150,180,200,.4)' },
  WET: { sunx: '70%', suny: '26%', skyWash: 'rgba(150,160,165,.45)' },
  MILD: { sunx: '72%', suny: '16%', skyWash: 'rgba(230,200,150,.4)' },
};

// Default fallback values used when geo fails entirely (spec fallback table)
const GEO_FAIL_DEFAULTS = {
  readLine: 'Built for skin, built for weather — wherever you are.',
  originPumps: '2 pumps',
  auraPearls: '2 pearls - "your everyday amount"',
  reapplyLine: 'Every 2-3 hours if you\'re out for long.',
  leadProduct: 'Aura' as const,
};

// Count-up hook for the temperature number
function useCountUp(target: number | null, duration = 1) {
  const [display, setDisplay] = useState(0);
  const prevTarget = useRef<number | null>(null);

  useEffect(() => {
    if (target === null) return;
    const from = prevTarget.current ?? 0;
    const controls = animate(from, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prevTarget.current = target;
    return () => controls.stop();
  }, [target, duration]);

  return display;
}

export default function ClimateHero() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [geoError, setGeoError] = useState<boolean>(false);       // geo fully failed
  const [weatherError, setWeatherError] = useState<boolean>(false); // city ok, weather API failed

  useEffect(() => {
    async function fetchLocationAndWeather() {
      setLoading(true);
      let city: string | null = null;
      let lat: number | null = null;
      let lon: number | null = null;

      // 1. Silent IP Geolocation
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        if (!ipRes.ok) throw new Error('Geo IP failed');
        const ipData = await ipRes.json();
        city = ipData.city || null;
        lat = ipData.latitude ?? null;
        lon = ipData.longitude ?? null;
        if (!city || lat === null || lon === null) throw new Error('Geo incomplete');
      } catch (err) {
        console.error('Geo fetch error:', err);
        setGeoError(true);
        setLoading(false);
        return; // Nothing more we can do — full fallback state
      }

      // 2. Open-Meteo Current Weather + Current UV + Daily Peak UV + is_day
      try {
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,uv_index,is_day&daily=uv_index_max&timezone=auto`
        );
        if (!weatherRes.ok) throw new Error('Weather API failed');
        const weatherData = await weatherRes.json();

        const temp = Math.round(weatherData.current.temperature_2m);
        const humidity = Math.round(weatherData.current.relative_humidity_2m);
        const precip = weatherData.current.precipitation > 0;
        const isDay = weatherData.current.is_day === 1;
        const currentUV = Math.round(weatherData.current.uv_index ?? 0);
        const peakUV = Math.round(weatherData.daily.uv_index_max[0] ?? 5);

        // Step 1 — Classify. Classification always uses today's PEAK UV
        // (per spec: "shows peak, not 0 at night" — the band logic shouldn't
        // flip to a lower band just because it's dark out).
        let band: WeatherBand = 'MILD';
        if (precip || humidity >= 80) {
          band = 'WET';
        } else if (temp <= 15) {
          band = 'COLD';
        } else if (temp >= 38 && humidity < 40) {
          band = 'DRY_HEAT';
        } else if (temp >= 30 && humidity >= 55) {
          band = 'HUMID_HEAT';
        } else if (peakUV >= 8 && humidity < 55) {
          band = 'HIGH_SUN';
        }

        setWeather({ city: city as string, temp, humidity, currentUV, peakUV, isDay, precip, band });
        setWeatherError(false);
      } catch (err) {
        console.error('Weather fetch error:', err);
        // City known, weather failed — keep city, hide numbers
        setWeather({
          city: city as string,
          temp: 0,
          humidity: 0,
          currentUV: 0,
          peakUV: 0,
          isDay: true,
          precip: false,
          band: 'MILD',
        });
        setWeatherError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchLocationAndWeather();
  }, []);

  const currentBand = weather?.band || 'MILD';
  const bandConfig = geoError ? null : BAND_CONFIGS[currentBand];
  const bandVisual = geoError ? BAND_VISUALS.MILD : BAND_VISUALS[currentBand];

  const animatedTemp = useCountUp(!loading && !geoError && !weatherError ? weather?.temp ?? null : null, 1.2);

  // ── Day/Night UV display logic ──
  // Daytime  → show current UV, label "UV Index"
  // Night    → show today's peak UV, label "Today's Peak UV"
  const isDay = weather?.isDay ?? true;
  const uvDisplayValue = isDay ? weather?.currentUV : weather?.peakUV;
  const uvLabel = isDay ? "UV Index" : "Today's Peak UV";
  const animatedUV = useCountUp(!loading && !geoError && !weatherError ? uvDisplayValue ?? null : null, 1);

  // ── Heading logic per fallback spec ──
  let heading = 'Your weather, right now';
  if (geoError) heading = 'Built for wherever you are';
  else if (weatherError) heading = "Sun care built for your weather, whatever it's doing today";

  // ── Content used for read-line / doses / reapply / lead product ──
  const activeConfig = geoError
    ? GEO_FAIL_DEFAULTS
    : bandConfig ?? GEO_FAIL_DEFAULTS;

  return (
    <section
      className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 pt-24 pb-12 text-[var(--brand-cream)]"
      style={
        {
          '--sunx': bandVisual.sunx,
          '--suny': bandVisual.suny,
        } as React.CSSProperties
      }
    >
      {/* ── Step 5: Sky wash background layer, driven by band ── */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 transition-[background] duration-[1200ms] ease-out"
        style={{
          background: `radial-gradient(circle at var(--sunx) var(--suny), ${bandVisual.skyWash}, transparent 60%)`,
        }}
      />

      {/* 1. Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-editorial whitespace-nowrap text-[clamp(1.15rem,6.2vw,4.5rem)] text-center mb-3 font-normal tracking-wide"
      >
        {heading}
      </motion.h1>

      {/* 2. Weather Widget Box — hidden entirely if geo failed */}
      {!geoError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-[620px] bg-black/25 backdrop-blur-md rounded-lg pt-4 pb-5 px-6 md:px-8 border border-white/10 text-center shadow-2xl mb-4"
        >
          <p className="text-base md:text-lg font-editorial tracking-wide opacity-90 mb-3">
            {weather?.city ? `Right now in ${weather.city}` : 'Sun care for your weather'}
          </p>

          {weatherError ? (
            // Weather API failed but city is known — hide numbers per spec
            <p className="text-sm md:text-base opacity-80 font-light py-4">
              Weather details aren&apos;t available right now — but the essentials never change.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 md:gap-4 items-baseline justify-center">
              {/* Temperature — count-up animated */}
              <div className="flex flex-col items-center">
                <span className="font-editorial text-[clamp(2.5rem,5.5vw,4.2rem)] leading-none">
                  {loading ? '--' : `${animatedTemp}°`}
                </span>
                <span className="text-xs md:text-sm opacity-80 mt-1 font-sans">Celsius</span>
              </div>

              {/* Humidity */}
              <div className="flex flex-col items-center">
                <span className="font-editorial text-[clamp(2.5rem,5.5vw,4.2rem)] leading-none">
                  {loading ? '--' : `${weather?.humidity ?? 60}%`}
                </span>
                <span className="text-xs md:text-sm opacity-80 mt-1 font-sans">Humidity</span>
              </div>

              {/* UV — current during day, today's peak at night */}
              <div className="flex flex-col items-center">
                <span className="font-editorial text-[clamp(2.5rem,5.5vw,4.2rem)] leading-none">
                  {loading ? '--' : animatedUV}
                </span>
                <span className="text-xs md:text-sm opacity-80 mt-1 font-sans">{uvLabel}</span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 3. Recommendation & ReadLine */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center max-w-[720px] mb-6 px-4 font-sans leading-relaxed tracking-wide space-y-1"
      >
        <p className="text-lg md:text-xl font-normal opacity-95 italic">
          {activeConfig.readLine}
        </p>
        <p className="text-sm md:text-base opacity-80 font-light">
          Here&rsquo;s what your skin can wear today:
        </p>
      </motion.div>

      {/* 4. Product Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="grid grid-cols-2 gap-2 sm:gap-6 w-full max-w-[760px]"
      >
        {/* CARD 1: Aura */}
        <div className="bg-black/25 backdrop-blur-md rounded-none border border-white/10 overflow-hidden flex flex-col justify-between h-full group hover:border-white/20 transition-all relative">

          <div className="p-2.5 sm:p-5 flex items-start gap-2 sm:gap-4">
            <div className="relative w-14 h-14 min-[400px]:w-16 min-[400px]:h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-[#8B3A32] flex-shrink-0 overflow-hidden rounded-none">
              <Image
                src={asset('/pdp/aura-1.webp')}
                alt="Aura"
                fill
                className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col justify-center pt-0.5">
              <h3 className="font-editorial text-xl min-[400px]:text-2xl sm:text-3xl md:text-4xl mb-0.5 sm:mb-1 leading-none">Aura</h3>
              <p className="text-[11px] min-[400px]:text-xs sm:text-sm md:text-base opacity-90 leading-tight sm:leading-normal font-sans mt-0.5">
                {activeConfig.auraPearls}
              </p>
            </div>
          </div>
          <AddToBagButton
            product="aura"
            className="w-full bg-[#EAE3D2] text-[#6B241A] py-2 sm:py-3 text-xs sm:text-sm md:text-base font-medium hover:bg-white transition-colors"
          />
        </div>

        {/* CARD 2: Origin */}
        <div className="bg-black/25 backdrop-blur-md rounded-none border border-white/10 overflow-hidden flex flex-col justify-between h-full group hover:border-white/20 transition-all relative">

          <div className="p-2.5 sm:p-5 flex items-start gap-2 sm:gap-4">
            <div className="relative w-14 h-14 min-[400px]:w-16 min-[400px]:h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-[#8B3A32] flex-shrink-0 overflow-hidden rounded-none">
              <Image
                src={asset('/pdp/origin-1.webp')}
                alt="Origin"
                fill
                className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col justify-center pt-0.5">
              <h3 className="font-editorial text-xl min-[400px]:text-2xl sm:text-3xl md:text-4xl mb-0.5 sm:mb-1 leading-none">Origin</h3>
              <p className="text-[11px] min-[400px]:text-xs sm:text-sm md:text-base opacity-90 leading-tight sm:leading-normal font-sans mt-0.5">
                {activeConfig.originPumps}
              </p>
            </div>
          </div>
          <AddToBagButton
            product="origin"
            className="w-full bg-[#EAE3D2] text-[#6B241A] py-2 sm:py-3 text-xs sm:text-sm md:text-base font-medium hover:bg-white transition-colors"
          />
        </div>
      </motion.div>

      {/* 5. Reapply Line — always shown */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-center text-xs md:text-sm opacity-80 mt-6 font-sans font-light tracking-wide bg-black/20 px-4 py-2 border border-white/5 rounded-full"
      >
        <span className="font-medium text-white">Reapply:</span> {activeConfig.reapplyLine}
      </motion.p>
    </section>
  );
}