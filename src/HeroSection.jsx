import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react'; // Import a cute icon

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 px-8 py-8 md:px-16 md:py-12">
      
      {/* --- Top Left: Main Headline --- */}
      <div className="absolute top-12 left-8 md:top-20 md:left-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-left"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 tracking-tight leading-none">
            Hi, my name is{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent inline-block filter drop-shadow-sm">
              Gina.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light max-w-lg leading-relaxed">
            I love building intelligent systems with deep learning.
          </p>
        </motion.div>
      </div>


      {/* --- Bottom Right Container: Instructions & Badge --- */}
      <div className="absolute bottom-6 right-6 md:bottom-4 md:right-5 flex flex-col items-end gap-2">
        
        {/* 1. The "Click anywhere" instruction */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={mounted ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.p
            className="text-base md:text-lg text-gray-500 font-light text-right"
            animate={{ 
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Click anywhere to find out what I've been up to
          </motion.p>
        </motion.div>

        {/* 2. The "Made by Gina" Watermark Cover-up Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={mounted ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.4, type: "spring" }}
          // UPDATED CLASSES HERE:
          // 1. Changed bg-white/90 to bg-white/95 for better coverage
          // 2. Increased padding: py-1.5 -> py-2.5 and px-4 -> px-6
          className="bg-white/95 backdrop-blur-md border border-pink-50/50 shadow-md rounded-xl py-2.5 px-3 flex items-center gap-2"
        >
           {/* Slightly bigger icon to match new size */}
           <Heart className="w-4 h-4 text-pink-400 fill-pink-100" />
           {/* Slightly bigger text */}
           <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
              Made by Gina    
           </span>
        </motion.div>
      </div>

    </div>
  );
};

export default HeroSection;