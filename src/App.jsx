import React, { useState, lazy, Suspense } from 'react';

// FIX: Lazy load the heavy 3D library so the page loads instantly
const Spline = lazy(() => import('@splinetool/react-spline')); 
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

  // 3. Reset Key (Forces Scene Reload)
  // We use this to force the Spline scene to reload from scratch when exiting on Desktop.
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
  // This reverses the process.
  // FIX: Added Mobile check to prevent reloading the scene on phones (prevents white flash).
  const handleReturn = () => {
    setShowDesktop(false); // 1. Fade out UI first
    
    setTimeout(() => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // MOBILE: Just reset the UI state. 
        // We DO NOT increment resetKey here, so the scene doesn't reload/flash white.
        setIsZooming(false);
      } else {
        // DESKTOP: We must reload the scene to reset the Camera Zoom.
        setIsZooming(false);           
        setResetKey(prev => prev + 1); // Force React to re-render Spline
        setIsResetting(true);          // Trigger Silent Fade
      }
    }, 500); // Short delay for smooth transition
  };

  const handleSplineLoad = () => {
    // This runs when Spline is ready. It handles both Initial Load AND Resets.
    // FIX: Reduced artificial delay from 1000ms to 500ms for faster feel
    setTimeout(() => {
      setIsLoading(false);
      setIsResetting(false); // Fade scene back in smoothly
    }, 500);
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
          Only shows on 'isLoading' (First visit), NOT on 'isResetting'
         -------------------------------------------------- */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 100, 
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
          
          // Disable pointer events on the wrapper if we are zooming/desktop is open
          // Also disable on mobile so tapping doesn't rotate camera
          pointerEvents: window.innerWidth < 768 ? 'none' : (isZooming || showDesktop ? 'none' : 'auto'),

          cursor: (!isLoading && !isZooming && !isResetting) ? 'pointer' : 'default',
          
          transition: 'opacity 1s ease',
          // FIX: Opacity is 0 if Loading OR Resetting. 
          // This creates a smooth fade-out/fade-in effect without the white spinner screen.
          opacity: (isLoading || isResetting) ? 0 : 1 
        }}
      >
        {/* FIX: Suspense handles the lazy loading of the heavy 3D engine */}
        <Suspense fallback={null}>
          <Spline 
            key={resetKey}
            scene={splineUrl} 
            onLoad={handleSplineLoad}
            style={{ pointerEvents: window.innerWidth < 768 ? 'none' : 'auto' }}
          />
        </Suspense>
      </div>

      {/* LAYER 1: Watermark (PERMANENT) */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 40, 
          pointerEvents: 'none', // Allows clicks to pass through to the 3D scene
          transition: 'opacity 0.5s ease',
          opacity: 1 // Always visible
        }}
      >
        <Watermark />
      </div>

      {/* LAYER 1.5: THE INVISIBLE SHIELD */}
      {/* This blocks touches on the 3D scene so mobile users can scroll the desktop windows */}
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
        zIndex: 10, 
        pointerEvents: 'none', 
        transition: 'opacity 0.5s ease', 
        // Hide Hero if Loading, Zooming, OR Resetting
        opacity: (isLoading || isZooming || isResetting) ? 0 : 1 
      }}>
         <HeroSection />

         {/* --- ENTER BUTTON (MOBILE ONLY) --- */}
         {!isLoading && !isZooming && !isResetting && (
           <div className="absolute bottom-40 left-0 w-full flex justify-center z-[60] md:hidden pointer-events-auto">
             <button
               onClick={handleMobileEnter}
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
         <VirtualDesktop startSlideshow={showDesktop} onBack={handleReturn} />
      </div>

    </div>
  );
}