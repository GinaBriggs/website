import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ isLoading }) => {
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
          <div className="grid grid-cols-2 gap-4 w-32 h-32">
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                className="bg-gray-800 rounded-lg"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;