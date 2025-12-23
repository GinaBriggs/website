import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ isLoading }) => {
  // The SVG path data from your purple heart icon
  const heartPath = "M12 21s-6.716-4.435-9.428-7.147C.86 12.14.5 10.736.5 9.25.5 6.462 2.962 4 5.75 4c1.74 0 3.41.81 4.25 2.09C10.84 4.81 12.51 4 14.25 4 17.038 4 19.5 6.462 19.5 9.25c0 1.486-.36 2.89-2.072 4.603C18.716 16.565 12 21 12 21z";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: '#f0f0f0' }}
          initial={{ opacity: 1 }}
          exit={{ 
            scale: 50, 
            opacity: 0,
            transition: { 
              duration: 0.8, 
              ease: [0.43, 0.13, 0.23, 0.96] 
            } 
          }}
        >
          {/* Heart Container with Pulse Animation */}
          <motion.div
            className="w-24 h-24 md:w-32 md:h-32"
            animate={{
              scale: [1, 1.15, 1, 1.15, 1], // Double beat pattern
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.5 // Pause between beats
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              className="w-full h-full"
            >
              {/* 1. Define the Clip Path (The Heart Shape) */}
              <defs>
                <clipPath id="heart-fill-clip">
                  <path d={heartPath} />
                </clipPath>
              </defs>

              {/* 2. Background Heart (Light Purple Fill) */}
              <path 
                d={heartPath} 
                fill="#F3E8FF" 
                stroke="none" 
              />

              {/* 3. The Filling Animation (Darker Purple) */}
              <g clipPath="url(#heart-fill-clip)">
                <motion.rect
                  x="0" 
                  y="24" // Start at the bottom
                  width="24" 
                  height="24"
                  fill="#A855F7" // The Vibrant Purple
                  animate={{ y: -28 }} // Move up to cover the heart
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              </g>

              {/* 4. The Outline (Sits on top to keep edges crisp) */}
              <path 
                d={heartPath} 
                fill="none" 
                stroke="#A855F7" 
                strokeWidth="1.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;