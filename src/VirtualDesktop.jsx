import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, FolderOpen, Mail, GripHorizontal, Brain, LogOut, Loader2 } from 'lucide-react'; 

// --- OPTIMIZATION: LAZY LOAD HEAVY APPS ---
// These components will now only load when the window is actually opened.
const TrainingSim = lazy(() => import('./TrainingSim'));
const AutoNav = lazy(() => import('./AutoNav'));
const FaceRecognition = lazy(() => import('./FaceRecognition'));
const ProjectDetail = lazy(() => import('./ProjectDetail'));

// Simple Loading Component for the Windows
const WindowLoader = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-50">
    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    <span className="ml-3 text-gray-500 font-medium">Loading App...</span>
  </div>
);

const VirtualDesktop = ({ startSlideshow, onBack }) => {
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);

  // --- 1. BACKGROUND CONFIGURATION ---
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  
  const backgroundImages = [
    "./pictures/Wallpaper1.webp",
    "./pictures/Wallpaper2.webp",
    "./pictures/Wallpaper3.webp",
    "./pictures/Wallpaper4.webp", 
    "./pictures/Wallpaper5.webp",
    "./pictures/Wallpaper6.webp",
    "./pictures/Wallpaper7.webp",
    "./pictures/Wallpaper8.webp",
  ];

  // --- FIX: PRELOAD IMAGES ---
  // This forces the browser to download all images in the background immediately
  useEffect(() => {
    backgroundImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // --- 2. SLIDESHOW TIMER ---
  useEffect(() => {
    if (!startSlideshow) return;
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 6000); 

    return () => clearInterval(timer);
  }, [backgroundImages.length, startSlideshow]);

  // --- 3. WINDOW MANAGEMENT LOGIC ---

  const openWindow = (appConfig) => {
    if (!openWindows.find(w => w.id === appConfig.id)) {
      
      const isMobile = window.innerWidth < 768;
      const isLargeApp = ['trainingsim', 'autonav', 'facerecodetails', 'facereco'].includes(appConfig.id);

      const newWindow = {
        id: appConfig.id,
        title: appConfig.content.title,     
        body: appConfig.content.body,
        footer: appConfig.content.footer, 
        
        width: isMobile ? window.innerWidth * 0.90 : (isLargeApp ? 1000 : 500),
        height: isMobile ? window.innerHeight * 0.80 : (isLargeApp ? 700 : 500),
        
        x: isMobile ? window.innerWidth * 0.05 : 50 + openWindows.length * 30,
        y: isMobile ? window.innerHeight * 0.10 : 50 + openWindows.length * 30,
      };

      setOpenWindows([...openWindows, newWindow]);
      setActiveWindow(appConfig.id);
    } else {
      setActiveWindow(appConfig.id);
    }
  };

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter(w => w.id !== id));
    if (activeWindow === id) {
      setActiveWindow(openWindows[openWindows.length - 2]?.id || null);
    }
  };

  const bringToFront = (id) => {
    setActiveWindow(id);
  };

  const updateWindow = (id, newProps) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === id ? { ...w, ...newProps } : w
    ));
  };

  // --- 4. APP DATA & CONFIGURATIONS ---

  const faceRecoData = {
    title: "Biometric Security System",
    tagline: "A Python based facial recognition pipeline achieving 98% accuracy on local datasets using Euclidean distance mapping.",
    category: "Computer Vision",
    date: "2024 Group Project",
    problem: "Traditional security systems rely on keycards or passwords, which can be stolen. I needed to build a touchless identity verification system that could run on standard hardware without expensive cloud APIs.",
    features: [
      { title: "Real time Detection", desc: "Processes video feeds at 30fps using optimized HOG (Histogram of Oriented Gradients) algorithms." },
      { title: "128-Point Encoding", desc: "Maps unique facial features to a 128-dimensional vector space for high precision comparison." },
      { title: "Local Processing", desc: "Privacy first architecture. No biometric data is ever sent to the cloud." },
      { title: "Dynamic Resizing", desc: "Implements adaptive frame scaling (0.25x) to maintain performance on lower end CPUs." }
    ],
    tech: ["Python 3.9", "OpenCV", "dlib", "NumPy", "Face_Recognition"],
    screenshots: [
      "./pictures/Screenshot.webp", 
      "./pictures/Screenshot0.webp"
    ],
    learned: "I learned how to optimize matrix operations using NumPy to handle real time video data. I also gained a deep understanding of the trade offs between HOG and CNN face detectors which is balancing accuracy vs. speed for real world deployment.",
    links: {
      github: "https://github.com/AweleChizim/projects/tree/main/Face%20Recognition%20System%20Group%202", 
      demo: null 
    }
  };

  // --- APP DEFINITIONS (Hidden Apps) ---
  // FIX: Wrapped bodies in Suspense so they load asynchronously

  const simAppConfig = {
    id: 'trainingsim',
    label: 'AI Training Sim',
    content: {
      title: 'Training Dynamics Visualization',
      body: (
        <div className="w-full h-full bg-black overflow-hidden relative">
          <Suspense fallback={<WindowLoader />}>
            <TrainingSim />
          </Suspense>
        </div>
      )
    }
  };

  const autoNavConfig = {
    id: 'autonav',
    label: 'AutoNav Vision',
    content: {
      title: 'Autonomous Vehicle Dashboard',
      body: (
        <div className="w-full h-full bg-black overflow-hidden relative">
          <Suspense fallback={<WindowLoader />}>
            <AutoNav />
          </Suspense>
        </div>
      )
    }
  };

  const faceRecoAppConfig = {
    id: 'facereco',
    label: 'Face Recognition Code',
    content: {
      title: 'Project Source Code',
      body: (
        <div className="w-full h-full bg-[#1e1e1e] overflow-hidden relative">
          <Suspense fallback={<WindowLoader />}>
            <FaceRecognition />
          </Suspense>
        </div>
      )
    }
  };

  const faceRecoDetailsConfig = {
    id: 'facerecodetails',
    label: 'Face ID Case Study',
    content: {
      title: 'Project: Biometric Security',
      body: (
        <Suspense fallback={<WindowLoader />}>
          <ProjectDetail project={faceRecoData} onBack={() => closeWindow('facerecodetails')} />
        </Suspense>
      )
    }
  };

  // --- 5. DESKTOP ICONS (Main Menu) ---
  const desktopIcons = [
    {
      id: 'about',
      label: 'About Me',
      icon: User,
      content: {
        title: 'About Me',
        body: (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-32 shrink-0">
                <div className="aspect-square rounded-lg bg-gray-200 overflow-hidden shadow-sm">
                  <img 
                    src="/pictures/IMG_2261.webp" 
                    alt="Gina 1" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    loading="lazy" 
                  />
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                I’m Gina, a computer science student and aspiring deep learning engineer who's interested in building intelligent systems that solve everyday problems. My work sits at the intersection of software engineering, machine learning, and applied research.
              </p>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
              <div className="w-full md:w-32 shrink-0">
                <div className="aspect-square rounded-lg bg-gray-200 overflow-hidden shadow-sm">
                   <img 
                    src="/pictures/IMG_2269.webp" 
                    alt="Gina 2" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                I’m particularly focused on deep learning, large language models, and AI systems that combine technical foundations with practical impact. I loveee turning complex ideas into usable products, whether that’s through research driven projects, frontend interfaces like this one, or AI tools.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-32 shrink-0">
                <div className="aspect-square rounded-lg bg-gray-200 overflow-hidden shadow-sm">
                   <img 
                    src="/pictures/IMG_2265.webp" 
                    alt="Gina 3" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                Beyond coding, I’m curious about how technology shapes decision making, the way we behave and the future of intelligence. I’m constantly learning, experimenting, and refining my skills to grow into a high impact engineer and researcher.
              </p>
            </div>

          </div>
        )
      }
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderOpen,
      content: {
        title: 'My Projects',
        body: (
          <div className="space-y-6">
            
            {/* Project 1 */}
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-semibold text-gray-800 mb-2">3D Portfolio Website</h4>
              <p className="text-gray-600 text-sm">Interactive portfolio with Three.js and React</p>
            </div>

            {/* Project 4 - FACE RECOGNITION */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Face Recognition System</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    A Python-based biometric security system using OpenCV and Deep Learning embeddings.
                  </p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 ml-4">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => openWindow(faceRecoAppConfig)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white rounded text-xs font-medium hover:bg-black transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  View Code
                </button>

                <button 
                  onClick={() => openWindow(faceRecoDetailsConfig)}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                >
                  Read Case Study
                </button>
              </div>
            </div>

            {/* Project 2 - THE SIMULATOR LAUNCHER */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Training Dynamics Simulator</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    A visual exploration of how neural networks learn, built with Three.js.
                    Visualizes high-dimensional manifold optimization.
                  </p>
                </div>
                <Brain className="w-10 h-10 text-gray-300 shrink-0 ml-4" />
              </div>
              
              <button 
                onClick={() => openWindow(simAppConfig)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
              >
                <Brain className="w-4 h-4" />
                Launch Simulator
              </button>
            </div>

          

            

          </div>
        )
      }
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: Mail,
      content: {
        title: 'Get In Touch',
        body: (
          <div className="space-y-4">
            <p className="text-gray-600">I'd love to hear from you! Feel free to reach out.</p>
            <div className="space-y-3">
              <a 
                href="mailto:gina.captain-briggs@pau.edu.ng"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer"
              >
                <Mail className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-gray-700 font-medium">Email</span>
              </a>

              <a 
                href="https://www.linkedin.com/in/ginacaptainbriggs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer"
              >
                <svg className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="text-gray-700 font-medium">Linkedin </span>
              </a>

              <a 
                href="https://github.com/GinaBriggs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer"
              >
                <svg className="w-5 h-5 text-gray-900 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-gray-700 font-medium">GitHub</span>
              </a>
            </div>
          </div>
        )
      }
    }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentBgIndex}
            src={backgroundImages[currentBgIndex]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover opacity-100" 
            alt="Desktop Wallpaper"
            // FIX: Added optimized loading attributes for performance
            loading="eager"
            decoding="async"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* --- BACK / EXIT BUTTON --- */}
      <div className="absolute top-6 right-6 z-50 pointer-events-auto">
        <button
          onClick={onBack}
          aria-label="Exit Desktop"
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-red-500/20 text-white rounded-full backdrop-blur-md border border-white/30 transition-all hover:scale-105 group"
        >
          <LogOut className="w-4 h-4 group-hover:text-red-300 transition-colors" />
          <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-red-100 transition-colors">Exit</span>
        </button>
      </div>

      {/* --- RESPONSIVE ICONS CONTAINER --- */}
      <div className="absolute 
        bottom-28 left-0 w-full flex flex-row justify-center gap-4 z-40 pointer-events-auto 
        md:top-8 md:left-8 md:w-auto md:flex-col md:justify-start md:gap-6 md:bottom-auto"
      >
        {desktopIcons.map((icon) => (
          <motion.button
            key={icon.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openWindow(icon)}
            aria-label={`Open ${icon.label}`}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover:bg-white/30 transition-colors">
              <icon.icon className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg" />
            </div>
            <span className="text-white text-xs md:text-sm font-medium drop-shadow-lg text-center max-w-[80px]">
              {icon.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Render Windows */}
      <AnimatePresence>
        {openWindows.map((window) => (
          <ResizableWindow
            key={window.id}
            window={window}
            isActive={activeWindow === window.id}
            onClose={closeWindow}
            onBringToFront={bringToFront}
            onUpdate={updateWindow}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- DRAGGABLE & RESIZABLE COMPONENT ---
const ResizableWindow = ({ window, isActive, onClose, onBringToFront, onUpdate }) => {
  const windowRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [initialDims, setInitialDims] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const handleMouseDownDrag = (e) => {
    if (window.innerWidth < 768) return; 
    if (e.target.closest('.window-controls')) return;
    e.preventDefault();
    onBringToFront(window.id);
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setInitialDims({ x: window.x, y: window.y });
  };

  const handleMouseDownResize = (e) => {
    if (window.innerWidth < 768) return; 
    e.preventDefault();
    e.stopPropagation();
    onBringToFront(window.id);
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setInitialDims({ w: window.width, h: window.height });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        onUpdate(window.id, {
          x: initialDims.x + dx,
          y: initialDims.y + dy
        });
      }
      
      if (isResizing) {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        onUpdate(window.id, {
          width: Math.max(300, initialDims.w + dx),
          height: Math.max(200, initialDims.h + dy)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, startPos, initialDims]);

  return (
    <motion.div
      ref={windowRef}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute pointer-events-auto flex flex-col"
      style={{
        left: window.x,
        top: window.y,
        width: window.width,
        height: window.height,
        zIndex: isActive ? 50 : 40,
      }}
      onMouseDown={() => onBringToFront(window.id)}
      role="dialog"
      aria-labelledby={`window-title-${window.id}`}
    >
      <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl border border-white/50 overflow-hidden relative">
        <div 
          className="window-header bg-gradient-to-r from-gray-100/90 to-gray-50/90 px-4 py-3 flex items-center justify-between cursor-move border-b border-gray-200/50 shrink-0 select-none"
          onMouseDown={handleMouseDownDrag}
        >
          <div className="flex items-center gap-2">
            <GripHorizontal className="w-4 h-4 text-gray-400" />
            <h3 id={`window-title-${window.id}`} className="text-gray-700 font-semibold text-sm">{window.title}</h3>
          </div>
          <div className="window-controls flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onClose(window.id); }}
              aria-label="Close Window"
              className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className={`flex-1 overflow-auto ${['trainingsim', 'facereco', 'autonav', 'facerecodetails'].includes(window.id) ? 'p-0' : 'p-6'}`}>
          {window.body}
        </div>

        {/* Sticky Footer (if defined in appConfig) */}
        {window.footer && (
          <div className="p-4 bg-white/50 border-t border-white/20 shrink-0 backdrop-blur-md">
            {window.footer}
          </div>
        )}
        
        {/* Resize Handle (Hidden on Mobile) */}
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-center justify-center z-50 hover:bg-gray-200/50 rounded-tl-lg transition-colors md:flex hidden"
          onMouseDown={handleMouseDownResize}
          aria-label="Resize Window"
          role="button"
        >
          <svg className="w-4 h-4 text-gray-400 -rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
             <path d="M21 21H12M21 21V12" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default VirtualDesktop;