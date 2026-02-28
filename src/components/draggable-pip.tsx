"use client";

import React, { useState, useRef, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PipPosition {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage of container width
}

interface DraggablePIPProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLElement | null>;
  onPositionChange: (pos: PipPosition) => void;
  initialPosition?: PipPosition;
  className?: string;
}

export function DraggablePIP({
  children,
  containerRef,
  onPositionChange,
  initialPosition = { x: 75, y: 75, width: 20 },
  className = "",
}: DraggablePIPProps) {
  const [position, setPosition] = useState<PipPosition>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const pipRef = useRef<HTMLDivElement>(null);
  
  // Ref for continuous updating to avoid dependency loops
  const positionRef = useRef(position);
  useEffect(() => {
    positionRef.current = position;
    onPositionChange(position);
  }, [position, onPositionChange]);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent dragging if clicking a button inside PIP
    if ((e.target as HTMLElement).closest("button")) return;
    
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current || !pipRef.current || isExpanded) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const pipRect = pipRef.current.getBoundingClientRect();

    // Calculate new raw position in pixels
    let newX = e.clientX - containerRect.left - pipRect.width / 2;
    let newY = e.clientY - containerRect.top - pipRect.height / 2;

    // Constrain to container
    newX = Math.max(0, Math.min(newX, containerRect.width - pipRect.width));
    newY = Math.max(0, Math.min(newY, containerRect.height - pipRect.height));

    // Convert back to percentages
    const percentageX = (newX / containerRect.width) * 100;
    const percentageY = (newY / containerRect.height) * 100;

    setPosition((prev) => ({
      ...prev,
      x: percentageX,
      y: percentageY,
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const toggleSize = () => {
    if (isExpanded) {
      setIsExpanded(false);
      setPosition({ ...positionRef.current, width: 20 });
    } else {
      setIsExpanded(true);
      setPosition({ x: 50, y: 50, width: 80 }); // center and expand
    }
  };

  // Convert percentage variables to CSS
  const style: React.CSSProperties = isExpanded
    ? {
        position: "absolute",
        top: "10%",
        left: "10%",
        width: "80%",
        height: "80%",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        zIndex: 40,
      }
    : {
        position: "absolute",
        top: `${position.y}%`,
        left: `${position.x}%`,
        width: `${position.width}%`,
        transition: isDragging ? "none" : "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        touchAction: "none", // Prevent scrolling while dragging
        zIndex: 40,
      };

  return (
    <div
      ref={pipRef}
      style={style}
      className={`group cursor-move shadow-2xl ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="relative w-full h-full rounded-2xl md:rounded-[3rem] overflow-hidden bg-black ring-4 ring-black/10 dark:ring-white/10">
        {children}
        
        {/* Hover Controls */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleSize();
            }}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
