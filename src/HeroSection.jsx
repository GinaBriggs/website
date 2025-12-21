import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      
      {/* LAYOUT FIX:
         - Mobile: pt-12 (was pt-24) to move text higher into the pink space.
         - Desktop: items-center (center align), padding-left-20 
      */}
      <div className="w-full h-full flex flex-col justify-start pt-12 px-8 md:justify-center md:pt-0 md:pl-20 max-w-4xl">
        
        {/* Animated Headline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-left"
        >
          {/* TEXT SIZE FIX: Reduced mobile size to text-4xl so it doesn't crowd the face */}
          <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-3 tracking-tight leading-none">
            Hi, my name is{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent inline-block filter drop-shadow-sm">
              Gina.
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-600 font-light max-w-lg leading-relaxed">
            I love building intelligent systems with deep learning.
          </p>
        </motion.div>

        {/* INSTRUCTION TEXT FIX:
           - Kept 'hidden md:block' to ensure this only shows on desktop/laptops.
        */}
        <div className="absolute bottom-10 right-10 hidden md:block">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={mounted ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 1 }}
            >
                <motion.p
                    className="text-sm text-gray-400 font-light text-right"
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
        </div>

      </div>
    </div>
  );
};

export default HeroSection;