'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type LizzardState = 'idle' | 'happy' | 'worried' | 'sleeping' | 'curious';

interface LizzardProps {
  celebration?: boolean;
  hasOverdueReminders?: boolean;
}

export default function Lizzard({ celebration = false, hasOverdueReminders = false }: LizzardProps) {
  const [state, setState] = useState<LizzardState>('idle');
  const [isVisible, setIsVisible] = useState(true);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Estado normal: dormir tras inactividad.
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      setState(prev => (prev !== 'sleeping' ? 'sleeping' : prev));
    }, 2 * 60 * 1000);

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  const visualState: LizzardState = celebration
    ? 'happy'
    : hasOverdueReminders
    ? 'worried'
    : state;

  const renderLizzard = () => {
    const baseVariants = {
      idle: { 
        initial: { opacity: 0, scale: 0 },
        animate: { y: [0, -5, 0], opacity: 1, scale: 1 }, 
        transition: { duration: 3, repeat: Infinity } 
      },
      happy: { 
        initial: { opacity: 0, scale: 0 },
        animate: { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0], opacity: 1 }, 
        transition: { duration: 0.8 } 
      },
      worried: { 
        initial: { opacity: 0, scale: 0 },
        animate: { x: [0, -3, 3, 0], rotate: [0, -2, 2, 0], opacity: 1 }, 
        transition: { duration: 0.5, repeat: Infinity } 
      },
      sleeping: { 
        initial: { opacity: 0, scale: 0 },
        animate: { opacity: 0.7, scale: 1 }, 
        transition: { duration: 0.5 } 
      },
      curious: { 
        initial: { opacity: 0, scale: 0 },
        animate: { x: -20, y: -10, opacity: 1, scale: 1 }, 
        transition: { duration: 0.4, type: 'spring' } 
      },
    };

    const currentVariant = baseVariants[visualState] || baseVariants.idle;

    return (
      <motion.svg
        viewBox="0 0 200 200"
        className="w-24 h-24 drop-shadow-lg"
        initial={currentVariant.initial}
        animate={currentVariant.animate}
        exit={{ opacity: 0, scale: 0 }}
        transition={currentVariant.transition}
      >
        {/* Cuerpo */}
        <ellipse cx="100" cy="120" rx="45" ry="50" fill="#C8E6F5" stroke="#B3D9FF" strokeWidth="2" />

        {/* Cabeza */}
        <circle cx="100" cy="60" r="35" fill="#D4F1E8" stroke="#9FE0C7" strokeWidth="2" />

        {/* Ojo izquierdo */}
        <circle cx="85" cy="50" r="6" fill="#333" />
        {visualState === 'sleeping' && <line x1="80" y1="50" x2="90" y2="50" strokeWidth="2" stroke="#333" />}
        {visualState !== 'sleeping' && <circle cx="87" cy="48" r="2" fill="white" />}

        {/* Ojo derecho */}
        <circle cx="115" cy="50" r="6" fill="#333" />
        {visualState === 'sleeping' && <line x1="110" y1="50" x2="120" y2="50" strokeWidth="2" stroke="#333" />}
        {visualState !== 'sleeping' && <circle cx="117" cy="48" r="2" fill="white" />}

        {/* Boca */}
        {visualState === 'happy' && <path d="M 95 65 Q 100 70 105 65" fill="none" stroke="#C85A54" strokeWidth="2" strokeLinecap="round" />}
        {visualState === 'worried' && <path d="M 95 68 Q 100 65 105 68" fill="none" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" />}
        {(visualState === 'idle' || visualState === 'curious') && <line x1="95" y1="65" x2="105" y2="65" strokeWidth="2" stroke="#333" strokeLinecap="round" />}
        {visualState === 'sleeping' && <path d="M 95 65 Q 100 67 105 65" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />}

        {/* Cola */}
        <path d="M 140 130 Q 170 120 175 80" fill="none" stroke="#9FE0C7" strokeWidth="8" strokeLinecap="round" />

        {/* Patitas */}
        <ellipse cx="75" cy="155" rx="8" ry="12" fill="#9FE0C7" />
        <ellipse cx="125" cy="155" rx="8" ry="12" fill="#9FE0C7" />
        <circle cx="70" cy="168" r="5" fill="#7FCFC0" />
        <circle cx="130" cy="168" r="5" fill="#7FCFC0" />

        {/* Cresta/puntos en la espalda para cute */}
        <circle cx="90" cy="110" r="4" fill="#9FE0C7" opacity="0.6" />
        <circle cx="100" cy="105" r="4" fill="#9FE0C7" opacity="0.6" />
        <circle cx="110" cy="110" r="4" fill="#9FE0C7" opacity="0.6" />
      </motion.svg>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100, y: 100 }}
          transition={{ type: 'spring', damping: 15 }}
          className="fixed bottom-24 md:bottom-6 right-6 z-40 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => {
            if (inactivityTimerRef.current) {
              clearTimeout(inactivityTimerRef.current);
            }
            setState('happy');
            setTimeout(() => {
              setState('idle');
              inactivityTimerRef.current = setTimeout(() => {
                setState('sleeping');
              }, 2 * 60 * 1000);
            }, 1000);
          }}
        >
          {renderLizzard()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
