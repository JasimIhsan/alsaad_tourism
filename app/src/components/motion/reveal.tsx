"use client";

import { EASE_OUT } from "@/lib/ease";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating, for simple staggers. */
  delay?: number;
  as?: "div" | "section" | "li" | "article";
};

const HIDDEN = { opacity: 0, y: 24 };
const SHOWN = { opacity: 1, y: 0 };

/**
 * Fades content up into place the first time it scrolls into view. It is rendered visible
 * (so server HTML and above-the-fold content never wait for JavaScript); only elements that
 * start below the fold are hidden after mount and revealed on scroll.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [belowFold, setBelowFold] = useState(false);

  useEffect(() => {
    const top = ref.current?.getBoundingClientRect().top ?? 0;
    setBelowFold(top > window.innerHeight);
  }, []);

  if (reduce) {
    return <Component className={className}>{children}</Component>;
  }

  const waiting = belowFold && !inView;
  return (
    <Component
      ref={ref as never}
      className={className}
      initial={false}
      animate={waiting ? HIDDEN : SHOWN}
      transition={waiting ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT, delay }}
    >
      {children}
    </Component>
  );
}
