import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, FolderOpen, Mail, GripHorizontal } from 'lucide-react';

const VirtualDesktop = ({ startSlideshow }) => {
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);

  // --- 1. BACKGROUND CONFIGURATION ---
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  
  // Replace these with your own image paths
  const backgroundImages = [
    "./pictures/Wallpaper1.jpg",
    "./pictures/Wallpaper2.jpg",
    "./pictures/Wallpaper3.jpg",
    "./pictures/Wallpaper4.jpg", 
    "./pictures/Wallpaper5.jpg",
    "./pictures/Wallpaper6.jpg",
    "./pictures/Wallpaper7.jpg",
    "./pictures/Wallpaper8.jpg",
    // Add as many as you want...
  ];

  // --- 2. SLIDESHOW TIMER ---
  useEffect(() => {
    if (!startSlideshow) return;
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(timer);
  }, [backgroundImages.length, startSlideshow]);

  // --- CONTENT CONFIGURATION ---
  const desktopIcons = [

      {
      id: 'about',
      label: 'About Me',
      icon: User,
      content: {
        title: 'About Me',
        body: (
          <div className="space-y-8">
            
            {/* --- PARAGRAPH 1: Picture LEFT --- */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Image Container */}
              <div className="w-full md:w-32 shrink-0">
                <div className="aspect-square rounded-lg bg-gray-200 overflow-hidden shadow-sm">
                  {/* REPLACE src WITH YOUR IMAGE PATH (e.g., src="/profile1.jpg") */}
                  <img 
                    src="./pictures/IMG_2261.JPG" 
                    alt="Gina 1" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </div>
              {/* Text */}
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                I’m Gina, a computer science student and aspiring deep learning engineer that's interested in building intelligent systems that solve everyday problems. My work sits at the intersection of software engineering, machine learning, and applied research.
              </p>
            </div>

            {/* --- PARAGRAPH 2: Picture RIGHT (flex-row-reverse) --- */}
            <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
              {/* Image Container */}
              <div className="w-full md:w-32 shrink-0">
                <div className="aspect-square rounded-lg bg-gray-200 overflow-hidden shadow-sm">
                   {/* REPLACE src WITH YOUR IMAGE PATH */}
                   <img 
                    src="./pictures/IMG_2269.JPG" 
                    alt="Gina 2" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                  />
                </div>
              </div>
              {/* Text */}
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                I’m particularly focused on deep learning, large language models, and AI systems that combine technical foundations with practical impact. I loveee turning complex ideas into usable products, whether that’s through research driven projects, frontend interfaces like this one, or AI tools.
              </p>
            </div>

            {/* --- PARAGRAPH 3: Picture LEFT --- */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Image Container */}
              <div className="w-full md:w-32 shrink-0">
                <div className="aspect-square rounded-lg bg-gray-200 overflow-hidden shadow-sm">
                   {/* REPLACE src WITH YOUR IMAGE PATH */}
                   <img 
                    src="./pictures/IMG_2265.JPG" 
                    alt="Gina 3" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                  />
                </div>
              </div>
              {/* Text */}
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
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-semibold text-gray-800 mb-2">3D Portfolio Website</h4>
              <p className="text-gray-600 text-sm">Interactive portfolio with Three.js and React</p>
            </div>
            {/* Add more projects here */}
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
              
              {/* 1. EMAIL LINK */}
              {/* Change href="mailto:..." to your actual email */}
              <a 
                href="mailto:gina.captain-briggs@pau.edu.ng"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer"
              >
                <Mail className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-gray-700 font-medium">Email</span>
              </a>

              {/* 2. LINKEDIN LINK */}
              {/* Change href="..." to your actual LinkedIn URL */}
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

  // --- WINDOW MANAGEMENT LOGIC ---

  const openWindow = (icon) => {
    if (!openWindows.find(w => w.id === icon.id)) {
      const newWindow = {
        id: icon.id,
        ...icon.content,
        x: 100 + openWindows.length * 30,
        y: 50 + openWindows.length * 30,
        width: 500,  // Default Width
        height: 400, // Default Height
      };
      setOpenWindows([...openWindows, newWindow]);
      setActiveWindow(icon.id);
    } else {
      setActiveWindow(icon.id);
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

  // Updates position OR size based on what changed
  const updateWindow = (id, newProps) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === id ? { ...w, ...newProps } : w
    ));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      
    {/* --- HERE WAS THE MISSING PART: THE BACKGROUND LAYER --- */}
    <div className="absolute inset-0 -z-10 overflow-hidden bg-black/10">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentBgIndex}
          src={backgroundImages[currentBgIndex]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover opacity-100" 
        />
      </AnimatePresence>
    </div>

    {/* Desktop Icons */}
      <div className="absolute top-8 left-8 flex flex-col gap-6 pointer-events-auto">
        {desktopIcons.map((icon) => (
          <motion.button
            key={icon.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openWindow(icon)}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover:bg-white/30 transition-colors">
              <icon.icon className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <span className="text-white text-sm font-medium drop-shadow-lg text-center max-w-[80px]">
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
  
  // Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  // Store initial values for calculations
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [initialDims, setInitialDims] = useState({ x: 0, y: 0, w: 0, h: 0 });

  // 1. Handle Dragging (Title Bar)
  const handleMouseDownDrag = (e) => {
    if (e.target.closest('.window-controls')) return; // Don't drag if clicking buttons
    
    e.preventDefault(); // Prevent text selection
    onBringToFront(window.id);
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setInitialDims({ x: window.x, y: window.y });
  };

  // 2. Handle Resizing (Corner Handle)
  const handleMouseDownResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBringToFront(window.id);
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setInitialDims({ w: window.width, h: window.height });
  };

  // 3. Global Mouse Move Listener
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
          width: Math.max(300, initialDims.w + dx), // Min width 300px
          height: Math.max(200, initialDims.h + dy) // Min height 200px
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
    >
      <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl border border-white/50 overflow-hidden relative">
        
        {/* --- HEADER (Draggable Area) --- */}
        <div 
          className="window-header bg-gradient-to-r from-gray-100/90 to-gray-50/90 px-4 py-3 flex items-center justify-between cursor-move border-b border-gray-200/50 shrink-0 select-none"
          onMouseDown={handleMouseDownDrag}
        >
          <div className="flex items-center gap-2">
            <GripHorizontal className="w-4 h-4 text-gray-400" />
            <h3 className="text-gray-700 font-semibold text-sm">{window.title}</h3>
          </div>
          <div className="window-controls flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onClose(window.id); }}
              className="w-6 h-6 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* --- CONTENT (Scrollable Area) --- */}
        <div className="flex-1 overflow-auto p-6">
          {window.body}
        </div>

        {/* --- RESIZE HANDLE (Bottom Right Corner) --- */}
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-center justify-center z-50 hover:bg-gray-200/50 rounded-tl-lg transition-colors"
          onMouseDown={handleMouseDownResize}
        >
          {/* Visual indicator for the corner */}
          <svg className="w-4 h-4 text-gray-400 -rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
             <path d="M21 21H12M21 21V12" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

      </div>
    </motion.div>
  );
};

export default VirtualDesktop;