import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Loader2 } from 'lucide-react'; 
import VirtualDesktop from './VirtualDesktop';
import HeroSection from './HeroSection'; 
import Watermark from './Watermark';
import LoadingScreen from './LoadingScreen'; 

const Spline = lazy(() => import('@splinetool/react-spline')); 

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [splineUrl] = useState(`https://prod.spline.design/cBPYSyt5K-z2YSet/scene.splinecode?t=${Date.now()}`);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) setIsLoading(false);
    }, 8000); 

    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleSceneClick = () => {
    if (isZooming || isLoading || isResetting || window.innerWidth < 768) return; 

    setIsZooming(true);
    setTimeout(() => {
      setShowDesktop(true);
    }, 4000);
  };

  const handleMobileEnter = () => {
    if (isZooming || isLoading || isResetting) return;

    setIsZooming(true);
    setTimeout(() => {
      setShowDesktop(true);
    }, 1500); 
  };

  const handleReturn = () => {
    setShowDesktop(false); 
    
    setTimeout(() => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        setIsZooming(false);
      } else {
        setIsZooming(false);           
        setResetKey(prev => prev + 1); 
        setIsResetting(true);          
      }
    }, 500); 
  };

  const handleSplineLoad = () => {
    setTimeout(() => {
      setIsLoading(false);
      setIsResetting(false); 
    }, 500);
  };

  return (
    <main className="w-full h-screen relative bg-[#f0f0f0] overflow-hidden">
      
      <LoadingScreen isLoading={isLoading} />

      <div className={`absolute inset-0 z-[100] bg-[#f0f0f0] flex items-center justify-center transition-opacity duration-500 ${isLoading ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>

      <section 
        onClick={handleSceneClick} 
        className={`absolute inset-0 z-1 transition-opacity duration-1000 ${isLoading || isResetting ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          pointerEvents: window.innerWidth < 768 ? 'none' : (isZooming || showDesktop ? 'none' : 'auto'),
          cursor: (!isLoading && !isZooming && !isResetting) ? 'pointer' : 'default'
        }}
      >
        <Suspense fallback={null}>
          <Spline 
            key={resetKey}
            scene={splineUrl} 
            onLoad={handleSplineLoad}
            className="w-full h-full"
            style={{ pointerEvents: window.innerWidth < 768 ? 'none' : 'auto' }}
          />
        </Suspense>
      </section>

      <div className="absolute inset-0 z-40 pointer-events-none transition-opacity duration-500">
        <Watermark />
      </div>

      <div className="absolute inset-0 z-[2] md:hidden pointer-events-auto bg-transparent" />
      
      {(isZooming || showDesktop) && (
        <div className="absolute top-0 left-0 w-full h-full z-[5] touch-auto" />
      )}

      <section className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 ${isLoading || isZooming || isResetting ? 'opacity-0' : 'opacity-100'}`}>
         <HeroSection />

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
      </section>

      <section className={`absolute inset-0 z-20 transition-opacity duration-1000 ${showDesktop ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         <VirtualDesktop startSlideshow={showDesktop} onBack={handleReturn} />
      </section>

    </main>
  );
}