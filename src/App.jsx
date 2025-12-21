import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Loader2 } from 'lucide-react'; 
import VirtualDesktop from './VirtualDesktop';
import HeroSection from './HeroSection'; 
import Watermark from './Watermark';

export default function App() {
  // 1. Loading State
  const [isLoading, setIsLoading] = useState(true);
  
  // 2. Interaction States
  // 'isZooming' acts as the trigger: when true, Hero fades out, Spline zooms in.
  const [isZooming, setIsZooming] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);

  // Your Spline URL (Cached once)
  const [splineUrl] = useState(`https://prod.spline.design/cBPYSyt5K-z2YSet/scene.splinecode?t=${Date.now()}`);

  const handleSceneClick = () => {
    if (isZooming || isLoading) return; 

    // This triggers the transition: Hero fades out, Camera zooms
    setIsZooming(true);

    // Wait 4 seconds for animation, then show desktop
    setTimeout(() => {
      setShowDesktop(true);
    }, 4000);
  };

  const handleSplineLoad = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      position: 'relative', 
      backgroundColor: '#f0f0f0', 
      overflow: 'hidden' 
    }}>
      
      {/* --------------------------------------------------
          LAYER 0: The Loading Screen
         -------------------------------------------------- */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 50, 
        backgroundColor: '#f0f0f0', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'opacity 0.5s ease, visibility 0.5s ease',
        opacity: isLoading ? 1 : 0,
        visibility: isLoading ? 'visible' : 'hidden', 
        pointerEvents: 'none' 
      }}>
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>

      {/* --------------------------------------------------
          LAYER 1: The 3D Scene (Clickable Layer)
         -------------------------------------------------- */}
      <div 
        // We keep this for desktop users who might click the background
        onClick={handleSceneClick} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 1,
          
          // Disable pointer events on the wrapper if we are zooming/desktop is open
          pointerEvents: (isZooming || showDesktop) ? 'none' : 'auto',

          cursor: (!isLoading && !isZooming) ? 'pointer' : 'default',
          transition: 'opacity 1s ease',
          opacity: isLoading ? 0 : 1 
        }}
      >
        <Spline 
          scene={splineUrl} 
          onLoad={handleSplineLoad}
          // This tells Spline: "If I am on mobile and the desktop is open, STOP listening to touches."
          style={{
            pointerEvents: (showDesktop && window.innerWidth < 768) ? 'none' : 'auto'
          }}
        />
      </div>

      {/* LAYER 1: The Watermark (PERMANENT) */}
      {!isLoading && !showDesktop && <Watermark />}

      {/* LAYER 1.5: THE INVISIBLE SHIELD (The Fix) */}
      {/* This blocks touches on the 3D scene so mobile users can scroll the desktop windows */}
      {(isZooming || showDesktop) && (
        <div 
          className="absolute top-0 left-0 w-full h-full z-[5]" 
          style={{
            touchAction: 'auto', 
          }}
        />
      )}

      {/* --------------------------------------------------
          LAYER 2: Hero Section + ENTER BUTTON
         -------------------------------------------------- */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 10, // Increased Z-Index to ensure button is clickable
        pointerEvents: 'none', 
        transition: 'opacity 0.5s ease', 
        opacity: (isLoading || isZooming) ? 0 : 1 
      }}>
         {/* Render the Hero Text */}
         <HeroSection />

         {/* --- THE MOBILE FIX: A REAL BUTTON --- */}
         {/* This ensures mobile users can click "Enter" without rotating the camera */}
         {!isLoading && !isZooming && (
           <div className="absolute bottom-20 left-0 w-full flex justify-center pointer-events-auto">
             <button
               onClick={handleSceneClick}
               className="bg-black/80 text-white px-8 py-3 rounded-full font-semibold backdrop-blur-md border border-white/20 shadow-xl hover:scale-105 transition-transform active:scale-95"
             >
               Enter Portfolio
             </button>
           </div>
         )}
      </div>

      {/* --------------------------------------------------
          LAYER 3: The Virtual Desktop UI
         -------------------------------------------------- */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 20,
        opacity: showDesktop ? 1 : 0, 
        transition: 'opacity 1s ease', 
        pointerEvents: showDesktop ? 'auto' : 'none' 
      }}>
         <VirtualDesktop startSlideshow={showDesktop} />
      </div>

    </div>
  );
}