import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Watermark = () => {
  return (
    // Fixed: Changed 'absolute' to 'fixed' so it stays on screen even if you scroll/zoom
    // Also removed the flex wrapper since it's just one item now
    <div className="fixed bottom-6 right-6 md:bottom-4 md:right-5 z-50 flex flex-col items-end gap-2">
      
      <motion.div
        // 1. Initial State: Invisible and slightly down
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        
        // 2. Animate State: Visible and in place (Removed the 'mounted' check)
        animate={{ opacity: 1, y: 0, scale: 1 }}
        
        // 3. Transition: Smooth spring effect
        transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
        
        className="bg-white/95 backdrop-blur-md border border-pink-50/50 shadow-md rounded-xl py-2.5 px-3 flex items-center gap-2"
      >
        <Heart className="w-4 h-4 text-pink-400 fill-pink-100" />
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
          Made by Gina
        </span>
      </motion.div>
    </div>
  );
};

export default Watermark;