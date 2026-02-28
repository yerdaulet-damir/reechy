"use client";

import React, { useState, useRef, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PipPosition {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage of container width
}

export interface PipShape {
  type: "circle" | "rounded" | "square" | "full";
  className: string;
}

const PIP_SHAPES: Record<PipShape["type"], PipShape> = {
  circle: { type: "circle", className: "rounded-full" },
  rounded: { type: "rounded", className: "rounded-2xl md:rounded-[2.5rem]" },
  square: { type: "square", className: "rounded-xl" },
  full: { type: "full", className: "rounded-none" },
};

interface DraggablePIPProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLElement | null>;
  onPositionChange: (pos: PipPosition) => void;
  initialPosition?: PipPosition;
  className?: string;
  shape?: PipShape["type"];
  isMirrored?: boolean;
}

export function DraggablePIP({
  children,
  containerRef,
  onPositionChange,
  initialPosition = { x: 75, y: 75, width: 22 },
  className = "",
  shape = "rounded",
  isMirrored = false,
}: DraggablePIPProps) {
  const [position, setPosition] = useState<PipPosition>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const pipRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Ref for continuous updating to avoid dependency loops
  const positionRef = useRef(position);
  useEffect(() => {
    positionRef.current = position;
    onPositionChange(position);
  }, [position, onPositionChange]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent dragging if clicking a button inside PIP
    if ((e.target as HTMLElement).closest("button")) return;

    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);

    // Add visual feedback
    if (pipRef.current) {
      pipRef.current.style.cursor = "grabbing";
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current || !pipRef.current || isExpanded) return;

    // Use requestAnimationFrame for smoother dragging performance
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (!containerRef.current || !pipRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const pipRect = pipRef.current.getBoundingClientRect();

      // Calculate new raw position in pixels
      let newX = e.clientX - containerRect.left - pipRect.width / 2;
      let newY = e.clientY - containerRect.top - pipRect.height / 2;

      // Constrain to container with padding
      const padding = 8;
      newX = Math.max(padding, Math.min(newX, containerRect.width - pipRect.width - padding));
      newY = Math.max(padding, Math.min(newY, containerRect.height - pipRect.height - padding));

      // Convert back to percentages
      const percentageX = (newX / containerRect.width) * 100;
      const percentageY = (newY / containerRect.height) * 100;

      setPosition((prev) => ({
        ...prev,
        x: percentageX,
        y: percentageY,
      }));
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);

      // Reset cursor
      if (pipRef.current) {
        pipRef.current.style.cursor = "";
      }
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      if (pipRef.current) {
        pipRef.current.style.cursor = "";
      }
    }
  };

  const toggleSize = () => {
    if (isExpanded) {
      setIsExpanded(false);
      setPosition({ ...positionRef.current, width: initialPosition.width });
    } else {
      setIsExpanded(true);
      setPosition({ x: 50, y: 50, width: 80 }); // center and expand
    }
  };

  // Get shape class
  const shapeClass = PIP_SHAPES[shape]?.className || PIP_SHAPES.rounded.className;

  // Convert percentage variables to CSS with smooth transitions
  const style: React.CSSProperties = isExpanded
    ? {
        position: "absolute",
        top: "10%",
        left: "10%",
        width: "80%",
        height: "80%",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        zIndex: 40,
      }
    : {
        position: "absolute",
        top: `${position.y}%`,
        left: `${position.x}%`,
        width: `${position.width}%`,
        transform: "translate(-50%, -50%)", // Center the PIP on the anchor point
        transition: isDragging ? "none" : "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        touchAction: "none", // Prevent scrolling while dragging
        zIndex: 40,
      };

  return (
    <div
      ref={pipRef}
      style={style}
      className={`
        group cursor-move shadow-2xl transition-transform duration-200
        ${isDragging ? "scale-[1.02]" : "scale-100"}
        ${className}
      `}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div className={`
        relative w-full h-full overflow-hidden bg-black ring-4 ring-black/10 dark:ring-white/10 shadow-xl
        ${shapeClass}
      `}>
        {/* Mirror effect applied at container level for consistent rendering */}
        <div className={`w-full h-full ${isMirrored ? "scale-x-[-1]" : ""}`}>
          {children}
        </div>

        {/* Hover Controls - fade in smoothly */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-all hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              toggleSize();
            }}
            aria-label={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Subtle border animation when dragging */}
        {isDragging && (
          <div className="absolute inset-0 rounded-inherit ring-2 ring-blue-500/50 pointer-events-none animate-pulse" />
        )}
      </div>
    </div>
  );
}
