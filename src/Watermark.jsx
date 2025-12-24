import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Watermark = () => {
  return (
    <aside className="fixed bottom-6 right-6 md:bottom-4 md:right-5 z-50 flex flex-col items-end gap-2">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
        className="bg-white/95 backdrop-blur-md border border-purple-50/50 shadow-md rounded-xl py-2.5 px-3 flex items-center gap-2"
      >
        <Heart className="w-4 h-4 text-purple-600 fill-purple-300" />
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
          Made by Gina
        </span>
      </motion.div>
    </aside>
  );
};

export default Watermark;