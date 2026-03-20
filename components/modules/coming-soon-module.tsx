'use client';

import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

export function ComingSoonModule() {
  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center max-w-sm"
      >
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-6"
        >
          <Rocket className="w-16 h-16 text-slate-400 dark:text-slate-500" />
        </motion.div>

        {/* Text */}
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Coming Soon
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base mb-8">
          This module is under construction and will be available soon.
        </p>

        {/* Decorative animation */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
