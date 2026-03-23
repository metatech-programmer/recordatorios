'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
}

export default function ConfettiCelebration() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const pastelColors = [
      '#E8D7F1', // lavender
      '#FFD5B8', // peach
      '#D4F1E8', // mint
      '#DCC9E8', // lilac
      '#FFD7E3', // rose
      '#C8E6F5', // sky
    ];

    const newPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.2,
      duration: 2 + Math.random() * 0.5,
      color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
    }));

    setPieces(newPieces);

    const timer = setTimeout(() => setPieces([]), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            opacity: 1,
            scale: Math.random() * 0.5 + 0.5,
            y: -50,
            x: Math.random() * 100 - 50,
          }}
          animate={{
            opacity: 0,
            scale: 0,
            y: window.innerHeight + 50,
            x: Math.random() * 200 - 100,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'circOut',
          }}
          className="fixed w-2 h-2 rounded-full"
          style={{
            left: `${piece.left}%`,
            top: 0,
            backgroundColor: piece.color,
          }}
        />
      ))}
    </div>
  );
}
