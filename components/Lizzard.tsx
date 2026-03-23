'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type PetState = 'idle' | 'walking' | 'sleeping' | 'curious' | 'running' | 'climbing' | 'peeking';

interface LizzardProps {
  celebration?: boolean;
  hasOverdueReminders?: boolean;
}

const LAZY_MESSAGES = [
  "¡Atrapa ese bug!",
  "¿Hacemos una pausa?",
  "Zzzz... ¿Ah, qué?",
  "¡Qué buen código!",
  "Mucho trabajo por hoy.",
  "¿Moscas? ¿Alguien dijo moscas?",
  "¡Me encanta pasear por aquí!",
  "¿Ya terminaste tus tareas?",
];

export default function Lizzard({ celebration = false, hasOverdueReminders = false }: LizzardProps) {
  const [state, setState] = useState<PetState>('idle');
  const [position, setPosition] = useState({ x: -100, y: -100 }); // Offscreen start
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = right, -1 = left
  const [rotation, setRotation] = useState(0); // For climbing walls
  const [isVisible, setIsVisible] = useState(false);
  const [dialogText, setDialogText] = useState<string | null>(null);
  
  const stateRef = useRef(state);
  const positionRef = useRef(position);
  const actionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep references fresh for event listeners
  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { positionRef.current = position; }, [position]);

  // Handle external states (Celebration/Overdue)
  useEffect(() => {
    if (celebration) {
      clearActionTimeout();
      setState('curious'); // '✨'
      setTimeout(() => scheduleNextAction(), 3000);
    }
  }, [celebration]);

  const scheduleNextAction = useCallback(() => {
    clearActionTimeout();
    setDialogText(null);
    
    // Choose time for next action (between 3 to 8 seconds)
    const delay = Math.random() * 5000 + 3000;
    
    actionTimeoutRef.current = setTimeout(() => {
      // If sleeping, maybe wake up
      if (stateRef.current === 'sleeping') {
        if (Math.random() > 0.7) {
          setState('idle');
          setRotation(0);
        }
        scheduleNextAction();
        return;
      }

      // Action probabilities
      const actions: PetState[] = ['idle', 'walking', 'sleeping', 'curious', 'climbing', 'peeking'];
      const weights = [0.15, 0.35, 0.1, 0.15, 0.15, 0.1]; 
      
      let r = Math.random();
      let chosenAction: PetState = 'idle';
      for (let i = 0; i < actions.length; i++) {
        if (r < weights[i]) {
          chosenAction = actions[i];
          break;
        }
        r -= weights[i];
      }

      setState(chosenAction);

      if (chosenAction === 'walking') {
        setRotation(0);
        const maxW = typeof window !== 'undefined' ? window.innerWidth - 80 : 500;
        // Avoid the exact center to keep it non-intrusive (mostly margins and headers/footers area)
        let newX = Math.random() * maxW;
        let newY = Math.random() > 0.5 
          ? Math.random() * 100 // Top area (Header)
          : (typeof window !== 'undefined' ? window.innerHeight - 150 : 700) + Math.random() * 50; // Bottom area
        
        setDirection(newX > positionRef.current.x ? 1 : -1);
        setPosition({ x: newX, y: newY });
      } 
      else if (chosenAction === 'climbing') {
        // Go to a wall (left or right) and climb
        const isLeftWall = Math.random() > 0.5;
        const newX = isLeftWall ? -10 : (typeof window !== 'undefined' ? window.innerWidth - 60 : 400); // stick to edge
        const newY = Math.max(100, Math.random() * (typeof window !== 'undefined' ? window.innerHeight - 200 : 500));
        
        // Rotate 90 deg pointing up if left wall, or -90 if right wall so it crawls UP
        setRotation(isLeftWall ? 90 : -90);
        setDirection(1); // Reset flip
        setPosition({ x: newX, y: newY });
      }
      else if (chosenAction === 'peeking') {
        // Peek from the bottom screen
        const maxW = typeof window !== 'undefined' ? window.innerWidth - 80 : 500;
        const newX = Math.random() * maxW;
        const newY = typeof window !== 'undefined' ? window.innerHeight - 30 : 800; // slightly hidden
        setRotation(0);
        setPosition({ x: newX, y: newY });
        
        // Sometimes talk
        if (Math.random() > 0.5) {
          setDialogText(LAZY_MESSAGES[Math.floor(Math.random() * LAZY_MESSAGES.length)]);
        }
      }

      scheduleNextAction();
    }, delay);
  }, []);

  // Initial spawn & Setup global click listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Spawn near bottom right
    const startX = Math.max(20, window.innerWidth - 120);
    const startY = Math.max(20, window.innerHeight - 180);
    setPosition({ x: startX, y: startY });
    setIsVisible(true);
    scheduleNextAction();

    // Global click listener to distract the lizard
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't react if clicked directly on the lizard (we handle that specifically)
      if (target.closest('#roaming-lizard') || target.closest('button')) return;

      // 30% chance to run to the click (don't overdo it, lest it becomes annoying)
      if (Math.random() < 0.3 && stateRef.current !== 'sleeping') {
        clearActionTimeout();
        setDialogText(null);
        setState('running');
        setRotation(0); // Reset rotation to run normally on ground
        
        const maxW = typeof window !== 'undefined' ? window.innerWidth - 80 : 500;
        const maxH = typeof window !== 'undefined' ? window.innerHeight - 80 : 800;
        // Travel near the click, but with a tiny offset so it doesn't block the exact point
        let destX = Math.max(10, Math.min(maxW, e.clientX - 40 + (Math.random() * 60 - 30)));
        let destY = Math.max(10, Math.min(maxH, e.clientY - 40 + (Math.random() * 60 - 30)));
        
        setDirection(destX > positionRef.current.x ? 1 : -1);
        setPosition({ x: destX, y: destY });

        // Resume normal behavior after arriving
        actionTimeoutRef.current = setTimeout(() => {
          if (stateRef.current === 'running') {
            setState('idle');
            scheduleNextAction();
          }
        }, 1500); 
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => {
      clearActionTimeout();
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [scheduleNextAction]);

  const clearActionTimeout = () => {
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
  };

  const handleLizardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearActionTimeout();
    setRotation(0);
    
    // Dialog logic mapping on click
    const INTERACTIVE_MESSAGES = [
      "¡No me toques!",
      "Haciendo cosquillas eh...",
      "Mejor termina tus recordatorios.",
      "Soy una mascota digital, ¿sabías?",
      "¡Qué día tan productivo!",
      "Te estoy vigilando...",
    ];
    
    setDialogText(INTERACTIVE_MESSAGES[Math.floor(Math.random() * INTERACTIVE_MESSAGES.length)]);
    
    // Wake up or be curious
    if (state === 'sleeping') {
      setState('curious');
    } else {
      setState('idle');
    }
    
    // Cute little jump!
    const jumpHeight = 35;
    const curY = position.y;
    setPosition(p => ({ ...p, y: Math.max(0, p.y - jumpHeight) }));
    
    setTimeout(() => {
      setPosition(p => ({ ...p, y: curY })); // Fall down
      setTimeout(() => {
        setDialogText(null);
        scheduleNextAction();
      }, 3500);
    }, 250);
  };

  // Wait for initial position to be set (client-side)
  if (!isVisible) return null;

  // Determine transition config based on state
  let moveDuration = 1.5;
  let moveEase = "easeInOut";
  if (state === 'walking') {
    moveDuration = 4 + Math.random() * 2; // slow stroll
  }
  if (state === 'running') {
    moveDuration = 1.2; // fast scurry!
    moveEase = "easeOut";
  }
  if (state === 'idle' || state === 'sleeping' || state === 'curious') {
    moveDuration = 0.3; // basically just jump/reset
  }

  // Visual flags
  const isSleeping = state === 'sleeping';
  const isWalking = state === 'walking' || state === 'running' || state === 'climbing' || state === 'peeking';
  const isCurious = state === 'curious' || celebration || hasOverdueReminders;
  const isWorried = hasOverdueReminders && !isWalking && !isSleeping;
  const animSpeed = state === 'running' ? 0.15 : 0.35; // Legs speed

  return (
    <motion.div
      id="roaming-lizard"
      initial={{ x: position.x, y: position.y, opacity: 0, rotate: 0 }}
      animate={{ 
        x: position.x, 
        y: position.y,
        scaleX: direction, // Flip visually based on direction
        rotate: rotation, // Wall climbing rotation
        opacity: 1
      }}
      transition={{ 
        x: { duration: moveDuration, ease: moveEase },
        y: { duration: moveDuration, ease: moveEase },
        rotate: { duration: 0.5 },
        scaleX: { duration: 0.3 },
        opacity: { duration: 0.5 }
      }}
      className="fixed z-[100] cursor-pointer pointer-events-auto"
      style={{ width: '70px', height: '70px' }}
      onClick={handleLizardClick}
      title="¡Click me!"
      aria-label="Mascota Lagartija interactiva"
    >
      <AnimatePresence>
        {dialogText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-xs text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 whitespace-nowrap z-10"
            style={{ 
              fontFamily: 'var(--font-display)', 
              pointerEvents: 'none',
              transform: `translate(-50%, 0) rotate(${-rotation}deg)` 
            }}
          >
            {dialogText}
            {/* Speech bubble tail */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="lizBody" x1="0%" y1="0%" x2="100%" y2="100%">
            {isWorried ? (
              <>
                <stop offset="0%" stopColor="#FF9800" />
                <stop offset="100%" stopColor="#FF5252" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#00FFA3" />
                <stop offset="100%" stopColor="#00B8D4" />
              </>
            )}
          </linearGradient>
          <filter id="lizGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.3"/>
            {!isSleeping && <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={isWorried ? "#FF9800" : "#00FFA3"} floodOpacity="0.6"/>}
          </filter>
        </defs>

        <g filter="url(#lizGlow)">
          {/* Animated Tail */}
          <motion.path 
            d="M 25 55 C 5 50, -5 75, 10 90 C 25 105, 45 75, 35 60 Z"
            fill="url(#lizBody)"
            animate={
              isWalking ? { rotate: [0, -15, 15, 0] } 
              : isSleeping ? { rotate: [0, 3, 0] } 
              : { rotate: [0, -5, 0] }
            }
            transition={{ duration: isWalking ? animSpeed : 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "35px", originY: "60px" }}
          />

          {/* Body */}
          <ellipse cx="50" cy="65" rx="25" ry="18" fill="url(#lizBody)" />

          {/* Legs (Animated when walking/running) */}
          <g fill={isWorried ? "#FF5252" : "#00C853"}>
            {/* Back Left */}
            <motion.ellipse cx="35" cy="80" rx="8" ry="4" 
              animate={isWalking ? { x: [0, -6, 6, 0], y: [0, -6, 0, 0] } : {}}
              transition={{ duration: animSpeed, repeat: Infinity }}
            />
            {/* Front Right */}
            <motion.ellipse cx="65" cy="80" rx="8" ry="4"
              animate={isWalking ? { x: [0, 6, -6, 0], y: [0, 0, -6, 0] } : {}}
              transition={{ duration: animSpeed, repeat: Infinity }}
            />
          </g>

          {/* Head (Bobs when walking, tilts when curious) */}
          <motion.g
            animate={
              isWalking ? { y: [0, -4, 0] } 
              : isCurious ? { rotate: -15, y: -5 } 
              : isSleeping ? { y: 4, rotate: 5 } 
              : { y: [0, -2, 0] }
            }
            transition={{ duration: isWalking ? animSpeed/2 : 2, repeat: Infinity }}
            style={{ originX: "70px", originY: "45px" }}
          >
            <ellipse cx="70" cy="45" rx="22" ry="18" fill="url(#lizBody)" />
            
            {/* Blush */}
            {!isWorried && <ellipse cx="62" cy="50" rx="5" ry="3" fill="#FF5252" opacity="0.6"/>}

            {/* Eyes */}
            {!isSleeping ? (
              <g>
                <ellipse cx="80" cy="40" rx="6" ry="9" fill="#FFFFFF" />
                <circle cx={isCurious ? "83" : "82"} cy="40" r="4" fill="#1A1025" />
                <circle cx={isCurious ? "84" : "83"} cy="38" r="1.5" fill="#FFFFFF" />
              </g>
            ) : (
              <path d="M 75 42 Q 80 45 85 40" stroke="#1A1025" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            )}

            {/* Mouth */}
            {!isSleeping && (
              <path 
                d={isWorried ? "M 82 54 Q 86 50 90 54" : "M 82 52 Q 86 56 90 50"} 
                stroke="#1A1025" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
              />
            )}
            
            {isCurious && !isSleeping && !isWorried && (
              <circle cx="86" cy="53" r="2.5" fill="#FF5252" />
            )}
          </motion.g>
        </g>

        {/* Floating texts based on state */}
        <AnimatePresence>
          {isSleeping && (
             <motion.text
               initial={{ opacity: 0, y: 10, x: 75 }}
               animate={{ opacity: [0, 1, 0], y: -30, x: 85, scale: [0.8, 1.2, 1] }}
               transition={{ duration: 2.5, repeat: Infinity }}
               fill="#00B8D4"
               fontSize="16"
               fontWeight="bold"
               style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.5)' }}
             >
               Zzz
             </motion.text>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(isCurious && !celebration) && (
             <motion.text
               initial={{ opacity: 0, scale: 0, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0 }}
               x="85" y="15"
               fill="#FF9800"
               fontSize="24"
               fontWeight="bold"
               style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.5)' }}
             >
               ?
             </motion.text>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {celebration && (
             <motion.text
               initial={{ opacity: 0, scale: 0, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0, rotate: [0, 10, -10, 0] }}
               transition={{ rotate: { repeat: Infinity, duration: 0.5 } }}
               exit={{ opacity: 0, scale: 0 }}
               x="85" y="15"
               fontSize="24"
               style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.5)' }}
             >
               ✨
             </motion.text>
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}
