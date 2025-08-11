"use client";

import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import { ReactNode, useRef, createContext, useContext } from "react";

const MouseContext = createContext<{ mouseX: MotionValue<number> | null }>({ mouseX: null });

interface DockIconProps {
  children: ReactNode;
  size?: number;
  magnification?: number;
  distance?: number;
  className?: string;
}

export function DockIcon({
  children,
  size = 40,
  magnification = 60,
  distance = 200,
  className,
  ...props
}: DockIconProps) {
  const { mouseX } = useContext(MouseContext);
  const ref = useRef<HTMLDivElement>(null);
  
  const distanceValue = useMotionValue(0);
  const widthTransform = useSpring(distanceValue, {
    stiffness: 400,
    damping: 30,
  });
  const sizeTransform = useTransform(widthTransform, [0, distance], [size, magnification]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !mouseX) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const distanceFromCenter = Math.abs(event.clientX - centerX);
    distanceValue.set(distanceFromCenter);
  };

  const handleMouseLeave = () => {
    distanceValue.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width: sizeTransform, height: sizeTransform }}
      className={`flex items-center justify-center rounded-xl backdrop-blur-sm border border-white/20 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface DockProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "middle" | "right";
}

export function Dock({
  children,
  className = "",
  direction = "middle",
}: DockProps) {
  const mouseX = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
  };

  const getDirectionClasses = () => {
    switch (direction) {
      case "left":
        return "justify-start";
      case "right":
        return "justify-end";
      default:
        return "justify-center";
    }
  };

  return (
    <MouseContext.Provider value={{ mouseX }}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`flex items-center gap-4 p-3 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/20 ${getDirectionClasses()} ${className}`}
      >
        {children}
      </motion.div>
    </MouseContext.Provider>
  );
}
