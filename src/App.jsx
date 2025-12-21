import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Loader2 } from 'lucide-react'; 
import VirtualDesktop from './VirtualDesktop';
import HeroSection from './HeroSection'; 
import Watermark from './Watermark';

export default function App() {
  // 1. Loading States
  const [isLoading, setIsLoading] = useState(true); // Initial Load (Shows Spinner)
  const [isResetting, setIsResetting] = useState(false); // Reset Load (Silent Fade)
  
  // 2. Interaction States
  // 'isZooming' acts as the trigger: when true, Hero fades out, Spline zooms in.
  const [isZooming, setIsZooming] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);

  // --- NEW: Reset Key ---
  // We use this to force the Spline scene to reload from scratch when exiting.
  // This ensures the camera resets to the room view instead of getting stuck zoomed in.
  const [resetKey, setResetKey] = useState(0);

  // Your Spline URL (Cached once)
  const [splineUrl] = useState(`https://prod.spline.design/cBPYSyt5K-z2YSet/scene.splinecode?t=${Date.now()}`);

  // --- 1. DESKTOP HANDLER (Mouse Click) ---
  // Triggers the slow, beautiful 4s zoom
  const handleSceneClick = () => {
    // Ignore on mobile (screen < 768px) so they don't accidentally trigger the slow zoom by tapping background
    if (isZooming || isLoading || isResetting || window.innerWidth < 768) return; 

    // This triggers the transition: Hero fades out, Camera zooms
    setIsZooming(true);

    // Wait 4 seconds for animation, then show desktop
    setTimeout(() => {
      setShowDesktop(true);
    }, 4000);
  };

  // --- 2. MOBILE HANDLER (Button Click) ---
  // Triggers a fast 1.5s fade (skips the zoom to avoid lag)
  const handleMobileEnter = () => {
    if (isZooming || isLoading || isResetting) return;

    setIsZooming(true);
    // Faster timeout! We don't wait for the camera zoom because the button can't trigger it.
    setTimeout(() => {
      setShowDesktop(true);
    }, 1500); 
  };

  // --- 3. RETURN HANDLER (Back Button) ---
  // This reverses the process: Fades out desktop -> Resets Zoom -> Reloads Scene
  const handleReturn = () => {
    setShowDesktop(false); // 1. Fade out UI first
    
    setTimeout(() => {
      setIsZooming(false);           // 2. Reset Zoom state
      setResetKey(prev => prev + 1); // 3. FORCE RESET the 3D Scene (Changes the key, forcing React to reload it)
      setIsResetting(true);          // 4. Trigger Silent Fade (No Spinner)
    }, 500); // Short delay for smooth transition
  };

  const handleSplineLoad = () => {
    // This runs when Spline is ready. It handles both Initial Load AND Resets.
    setTimeout(() => {
      setIsLoading(false);
      setIsResetting(false); // Fade scene back in smoothly
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
          LAYER 0: The Loading Screen (SPINNER)
          FIX: Only shows on 'isLoading' (First visit), NOT on 'isResetting'
         -------------------------------------------------- */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 100, // FIX: Increased to 100 to ensure it covers watermark 
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
          // CRITICAL FIX: Also disable on mobile so tapping doesn't rotate camera
          pointerEvents: window.innerWidth < 768 ? 'none' : (isZooming || showDesktop ? 'none' : 'auto'),

          cursor: (!isLoading && !isZooming && !isResetting) ? 'pointer' : 'default',
          
          transition: 'opacity 1s ease',
          // FIX: Opacity is 0 if Loading OR Resetting. 
          // This creates a smooth fade-out/fade-in effect without the white spinner screen.
          opacity: (isLoading || isResetting) ? 0 : 1 
        }}
      >
        {/* FIX: Added key={resetKey} to force full reload on exit */}
        <Spline 
          key={resetKey}
          scene={splineUrl} 
          onLoad={handleSplineLoad}
          // Extra safety: Stop Spline from listening on mobile
          style={{ pointerEvents: window.innerWidth < 768 ? 'none' : 'auto' }}
        />
      </div>

      {/* LAYER 1: Watermark (PERMANENT) */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 40, 
          // FIX 1: pointerEvents 'none' allows clicks to pass through to the scene
          pointerEvents: 'none', 
          transition: 'opacity 0.5s ease',
          // FIX 2: opacity is always 1, so it NEVER disappears
          opacity: 1
        }}
      >
        {/* Note: The Watermark component itself handles its own clickability */}
        <Watermark />
      </div>

      {/* LAYER 1.5: THE INVISIBLE SHIELD (The Fix) */}
      {/* This blocks touches on the 3D scene so mobile users can scroll the desktop windows */}
      {/* Also prevents 'drag' gestures on mobile by covering the scene with a transparent div */}
      <div className="absolute inset-0 z-[2] md:hidden pointer-events-auto bg-transparent" />
      
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
        // Hide Hero if Loading, Zooming, OR Resetting
        opacity: (isLoading || isZooming || isResetting) ? 0 : 1 
      }}>
         {/* Render the Hero Text */}
         <HeroSection />

         {/* --- ENTER BUTTON (MOBILE ONLY) --- */}
         {!isLoading && !isZooming && !isResetting && (
           <div className="absolute bottom-40 left-0 w-full flex justify-center z-[60] md:hidden pointer-events-auto">
             <button
               onClick={handleMobileEnter}
               // STYLE FIX: Changed to Glassmorphism (White/40 with Blur) instead of harsh Black
               className="bg-white/40 text-gray-900 px-8 py-3 rounded-full font-semibold backdrop-blur-md border border-white/50 shadow-xl active:scale-95 transition-transform"
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
         {/* FIX IS HERE: We pass the 'onBack' prop! */}
         <VirtualDesktop startSlideshow={showDesktop} onBack={handleReturn} />
      </div>

    </div>
  );
}