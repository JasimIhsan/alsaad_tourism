"use client";
// beui.dev/components/motion/button

import { EASE_OUT, SPRING_PRESS } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  useReducedMotion,
} from "motion/react";
import Link from "next/link";
import {
  type ComponentProps,
  forwardRef,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";

const MotionLink = motion.create(Link);

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "inverse"
  | "light";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends Omit<
  HTMLMotionProps<"button">,
  "children"
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pressScale?: number;
  /** Spawn a Material-style ripple from the press point. Off by default. */
  ripple?: boolean;
  children?: ReactNode;
}

export type ButtonLinkProps = Omit<
  ComponentProps<typeof MotionLink>,
  "children"
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pressScale?: number;
  children?: ReactNode;
};

type Ripple = { id: number; x: number; y: number; size: number };

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "border border-border bg-card text-foreground hover:border-border",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-muted/60",
  outline:
    "border-[1.5px] border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
  inverse: "bg-inverse text-inverse-foreground hover:bg-inverse-hover",
  light: "bg-background text-foreground hover:bg-accent",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm gap-1.5 rounded-full",
  md: "h-12 px-6 text-[0.9375rem] font-semibold gap-2 rounded-full",
  lg: "h-14 px-7 text-base font-semibold gap-2.5 rounded-full",
  icon: "size-11 rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      pressScale = 0.93,
      ripple = false,
      className,
      children,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const reduce = useReducedMotion();
    const canHover = useHoverCapable();
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const nextId = useRef(0);

    const handlePointerDown = useCallback(
      (event: PointerEvent<HTMLButtonElement>) => {
        if (ripple && !reduce) {
          const rect = event.currentTarget.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height) * 2;
          const id = nextId.current++;
          setRipples((prev) => [
            ...prev,
            {
              id,
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              size,
            },
          ]);
        }
        onPointerDown?.(event);
      },
      [ripple, reduce, onPointerDown],
    );

    return (
      <motion.button
        ref={ref}
        type="button"
        whileTap={reduce ? undefined : { scale: pressScale }}
        whileHover={reduce || !canHover ? undefined : { scale: 1.02 }}
        transition={SPRING_PRESS}
        onPointerDown={handlePointerDown}
        className={cn(
          "inline-flex items-center justify-center font-medium select-none",
          "transition-colors",
          "disabled:pointer-events-none disabled:opacity-50",
          ripple && "relative overflow-hidden",
          VARIANT_CLASS[variant],
          SIZE_CLASS[size],
          className,
        )}
        {...rest}
      >
        {ripple && !reduce ? (
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
            <AnimatePresence>
              {ripples.map((r) => (
                <motion.span
                  key={r.id}
                  className="absolute rounded-full bg-current"
                  style={{
                    left: r.x,
                    top: r.y,
                    width: r.size,
                    height: r.size,
                    x: "-50%",
                    y: "-50%",
                  }}
                  initial={{ scale: 0.05, opacity: 0.3 }}
                  animate={{ scale: 1, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.6, ease: EASE_OUT }}
                  onAnimationComplete={() =>
                    setRipples((prev) => prev.filter((x) => x.id !== r.id))
                  }
                />
              ))}
            </AnimatePresence>
          </span>
        ) : null}
        {children}
      </motion.button>
    );
  },
);

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    {
      variant = "primary",
      size = "md",
      pressScale = 0.93,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const reduce = useReducedMotion();
    const canHover = useHoverCapable();

    return (
      <MotionLink
        ref={ref}
        whileTap={reduce ? undefined : { scale: pressScale }}
        whileHover={reduce || !canHover ? undefined : { scale: 1.02 }}
        transition={SPRING_PRESS}
        className={cn(
          "inline-flex items-center justify-center font-medium select-none",
          "transition-colors",
          VARIANT_CLASS[variant],
          SIZE_CLASS[size],
          className,
        )}
        {...rest}
      >
        {children}
      </MotionLink>
    );
  },
);
