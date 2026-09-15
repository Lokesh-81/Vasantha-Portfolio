'use client';

import React, { useState, useEffect, Children } from 'react';
import { motion, AnimatePresence, type Transition, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TextLoopProps {
  key?: React.Key;
  children: React.ReactNode;
  className?: string;
  interval?: number;
  transition?: Transition;
  variants?: Variants;
  onIndexChange?: (index: number) => void;
}

const defaultVariants: Variants = {
  initial: {
    y: 12,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -12,
    opacity: 0,
  },
};

const defaultTransition: Transition = {
  duration: 0.35,
  ease: 'easeInOut',
};

export function TextLoop({
  children,
  className,
  interval = 2800,
  transition = defaultTransition,
  variants = defaultVariants,
  onIndexChange,
}: TextLoopProps) {
  const items = Children.toArray(children);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Normalize interval: if passed in seconds (e.g. 3), convert to ms (3000)
  const normalizedInterval = interval < 100 ? interval * 1000 : interval;

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, normalizedInterval);

    return () => clearInterval(timer);
  }, [items.length, normalizedInterval, onIndexChange]);

  if (!items.length) return null;

  return (
    <span
      className={cn('relative inline-flex items-center overflow-hidden py-0.5 min-h-[1.5em]', className)}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={transition}
          className="inline-flex items-center whitespace-nowrap will-change-transform"
        >
          {items[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
