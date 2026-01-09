'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function FairyDustCursor() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    let counter = 0;
    const colors = ['#5c7457', '#efd0ca', '#f5ede7', '#FFD700']; // Dusty olive, almond, pale oak, gold

    const removeSparkle = (sparkleId: number) => {
      setSparkles((prev) => prev.filter((s) => s.id !== sparkleId));
    };

    const createSparkle = (e: MouseEvent) => {
      const newSparkle = { 
        id: counter++, 
        x: e.clientX, 
        y: e.clientY,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      
      setSparkles((prev) => [...prev, newSparkle]);
      
      // Remove sparkle after a short delay
      setTimeout(() => removeSparkle(newSparkle.id), 1000);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Add a sparkle every few pixels or on every move
      if (Math.random() > 0.5) return; // Don't add on every single event to avoid too many nodes
      createSparkle(e);
    };

    globalThis.addEventListener('mousemove', handleMouseMove);
    return () => globalThis.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 1, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 0, y: 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full blur-[0.5px]"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              backgroundColor: sparkle.color,
              boxShadow: `0 0 6px ${sparkle.color}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
