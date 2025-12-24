import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ isLoading }) => {
  const heartPath = "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#f0f0f0]"
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
          <motion.div
            className="w-24 h-24 md:w-32 md:h-32"
            animate={{
              scale: [1, 1.15, 1, 1.15, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.5
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              className="w-full h-full"
              aria-label="Loading..."
            >
              <defs>
                <clipPath id="heart-fill-clip">
                  <path d={heartPath} />
                </clipPath>
              </defs>

              <path 
                d={heartPath} 
                fill="#F3E8FF" 
                stroke="none" 
              />

              <g clipPath="url(#heart-fill-clip)">
                <motion.rect
                  x="0" 
                  y="24" 
                  width="24" 
                  height="24"
                  fill="#A855F7" 
                  animate={{ y: -28 }} 
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              </g>

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