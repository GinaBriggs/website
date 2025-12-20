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

    // Wait 6 seconds for animation, then show desktop
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
        onClick={handleSceneClick} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 1,

          pointerEvents: (isZooming || showDesktop) ? 'none' : 'auto',

          cursor: (!isLoading && !isZooming) ? 'pointer' : 'default',
          transition: 'opacity 1s ease',
          opacity: isLoading ? 0 : 1 
        }}
      >
        <Spline 
          scene={splineUrl} 
          onLoad={handleSplineLoad}
          // This tells Spline: "If I am on mobile and the desktop is open, STOP listening."
          style={{
            pointerEvents: (showDesktop && window.innerWidth < 768) ? 'none' : 'auto'
          }}
        />
      </div>

      {/* LAYER 1: The Watermark (PERMANENT) */}
      {/* We put this here so it sits on top of Spline but is NOT affected by the 'isZooming' fade out below */}
      {!isLoading && <Watermark />}

      {/* LAYER 1.5: THE INVISIBLE SHIELD (The Fix) */}
      {/* This layer appears only when zooming or on desktop. 
          It sits at zIndex 5 (above Spline Z-1, below Desktop Z-10).
          It catches all mouse events so they don't hit the 3D scene. */}
      {(isZooming || showDesktop) && (
        <div 
          className="absolute top-0 left-0 w-full h-full z-[5]" // Tailwind for z-index 5
          style={{
            // This is the key: On mobile, this div covers the 3D scene completely
            // capturing all touches so they don't spin the camera.
            touchAction: 'auto', 
          }}
        />
      )}

      {/* --------------------------------------------------
          LAYER 2: Hero Section (Replaces Old Text)
         -------------------------------------------------- */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 2, 
        pointerEvents: 'none', // Allows clicks to pass through to the 3D scene
        transition: 'opacity 0.5s ease', 
        // Hide Hero Section when loading OR when zooming starts
        opacity: (isLoading || isZooming) ? 0 : 1 
      }}>
         {/* Render the Hero Component */}
         <HeroSection />
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
        zIndex: 10,
        opacity: showDesktop ? 1 : 0, 
        transition: 'opacity 1s ease', 
        pointerEvents: showDesktop ? 'auto' : 'none' 
      }}>
         <VirtualDesktop startSlideshow={showDesktop} />
      </div>

    </div>
  );
}