import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      
      {/* LAYOUT CONTAINER */}
      <div className="w-full h-full flex flex-col justify-start pt-6 px-8 md:justify-start md:pt-20 md:pl-20 max-w-4xl">
        
        {/* Animated Headline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-left"
        >
          {/* TYPEWRITER HEADLINE 
             - Changed "my name is" to "I'm" so it works with the cycling roles.
             - The 'TypeAnimation' component now handles the gradient text.
          */}
          <h1 className="text-3xl md:text-7xl font-bold text-gray-900 tracking-tight leading-tight mb-2 md:mb-4">
            Hi, I'm{' '}
            <TypeAnimation
              sequence={[
                'Gina.', // Text 1
                3000, 
                'a CS student.', // Text 2
                2000,
                'building AI Systems.', // Text 3
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              // This class applies the Purple/Pink Gradient to the typing text
              className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent inline-block filter drop-shadow-sm"
            />
          </h1>
        
        </motion.div>

  
            {/* --- ANIMATED CLICK INDICATOR (Desktop Only) --- */}
        {/* POSITION FIX: 'left-1/2 -translate-x-1/2' centers it horizontally */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
            <motion.div
                initial={{ opacity: 0 }}
                animate={mounted ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
            >
                {/* FLOATING ANIMATION WRAPPER: Moves the whole mouse Up/Down */}
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                  className="flex flex-col items-center gap-2"
                >
                    {/* Mouse Icon Body */}
                    <div className="relative w-7 h-11 border-2 border-white rounded-full flex justify-center pt-2 p-1 shadow-sm bg-white/10 backdrop-blur-sm">
                      {/* The Clicker/Button Animation (Pulses) */}
                      <motion.div
                        className="w-1.5 h-2.5 bg-white rounded-full"
                        animate={{
                           scale: [1, 0.8, 1],   
                           opacity: [1, 0.5, 1]  
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                    {/* Label */}
                    <span className="text-white text-[10px] uppercase tracking-widest font-medium text-center block text-shadow-sm">Click Anywhere</span>
                </motion.div>
            </motion.div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;