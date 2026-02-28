"use client";

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
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
  rounded: { type: "rounded", className: "rounded-2xl md:rounded-[3rem]" },
  square: { type: "square", className: "rounded-2xl" },
  full: { type: "full", className: "rounded-none" },
};

interface DraggablePIPProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLElement | null>;
  onPositionChange: (pos: PipPosition) => void;
  initialPosition?: PipPosition;
  className?: string;
  frameType?: "none" | "circle" | "square" | "rounded" | "film";
  isMirrored?: boolean;
  stream?: MediaStream | null; // Stream to bind to the video element
  videoEnabled?: boolean; // Track if camera is enabled to resume playback after toggle
}

export function DraggablePIP({
  children,
  containerRef,
  onPositionChange,
  initialPosition = { x: 75, y: 75, width: 22 },
  className = "",
  frameType = "rounded",
  isMirrored = false,
  stream = null,
  videoEnabled = true,
}: DraggablePIPProps) {
  const [position, setPosition] = useState<PipPosition>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState<'corner' | 'edge' | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const pipRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef(stream); // Track stream to re-bind when it changes

  // Ref for continuous updating to avoid dependency loops
  const positionRef = useRef(position);
  useEffect(() => {
    positionRef.current = position;
    onPositionChange(position);
  }, [position, onPositionChange]);

  // Update stream ref when stream changes
  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  /**
   * Bind stream to video element and apply mirror transform
   * Only binds if srcObject is different to avoid interrupting recording
   */
  useLayoutEffect(() => {
    const video = pipRef.current?.querySelector('video') as HTMLVideoElement | null;
    if (video) {
      // Only bind stream if not already set (prevents freeze during mode switch)
      if (stream && video.srcObject !== stream) {
        video.srcObject = stream;
      }

      // Apply mirror transform
      if (isMirrored !== undefined) {
        video.style.transform = isMirrored ? "scaleX(-1)" : "scaleX(1)";
      }
    }
  }, [stream, isMirrored]);

  /**
   * Ensure video plays when component mounts or when videoEnabled changes
   * This fixes the frozen video issue after camera toggle
   */
  useEffect(() => {
    const video = pipRef.current?.querySelector('video') as HTMLVideoElement | null;
    if (video && stream && videoEnabled) {
      // Check if video is actually playing, if not, start it
      if (video.paused) {
        video.play().catch(err => {
          if ((err as Error).name !== 'AbortError') {
            console.error("Error playing PIP video:", err);
          }
        });
      }
    }
  }, [stream, videoEnabled]); // Re-run when stream or videoEnabled changes

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
    if (isResizing) {
      setIsResizing(false);
      setResizeEdge(null);
    }
  };

  // Resize handlers for OBS-style corner/edge resizing
  const handleResizeStart = (e: React.PointerEvent, edge: 'corner' | 'edge') => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeEdge(edge);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizeMove = useCallback((e: React.PointerEvent) => {
    if (!isResizing || !containerRef.current || !pipRef.current || isExpanded) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (!containerRef.current || !pipRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const pipRect = pipRef.current.getBoundingClientRect();

      // Calculate new width based on mouse position
      let newWidth: number;
      if (resizeEdge === 'corner') {
        // Bottom-right corner resize
        const mouseX = e.clientX - containerRect.left;
        newWidth = ((mouseX - (position.x / 100 * containerRect.width)) / containerRect.width) * 100;
      } else {
        // Edge resize (simplified - using same logic for now)
        const mouseX = e.clientX - containerRect.left;
        newWidth = ((mouseX - (position.x / 100 * containerRect.width)) / containerRect.width) * 100;
      }

      // Constrain width between 10% and 80% of container
      newWidth = Math.max(10, Math.min(newWidth, 80));

      setPosition((prev) => ({
        ...prev,
        width: newWidth,
      }));
    });
  }, [isResizing, resizeEdge, position.x, isExpanded]);

  const handleResizeEnd = (e: React.PointerEvent) => {
    if (isResizing) {
      setIsResizing(false);
      setResizeEdge(null);
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
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

  // Map frameType to PIP shape
  const shapeForFrame = frameType === "circle" ? "circle"
                    : frameType === "square" ? "square"
                    : frameType === "rounded" ? "rounded"
                    : "full";  // "none" and "film" map to full
  const shapeClass = PIP_SHAPES[shapeForFrame]?.className || PIP_SHAPES.rounded.className;

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
        transition: (isDragging || isResizing) ? "none" : "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        touchAction: "none", // Prevent scrolling while dragging/resizing
        zIndex: 40,
      };

  return (
    <div
      ref={pipRef}
      style={style}
      className={`
        group relative shadow-2xl transition-transform duration-200
        ${isDragging ? "scale-[1.02]" : "scale-100"}
        ${isResizing ? "cursor-se-resize" : "cursor-move"}
        ${className}
      `}
      onPointerDown={handlePointerDown}
      onPointerMove={(e) => {
        handlePointerMove(e);
        handleResizeMove(e);
      }}
      onPointerUp={(e) => {
        handlePointerUp(e);
        handleResizeEnd(e);
      }}
      onPointerCancel={handlePointerCancel}
    >
      <div className={`
        relative w-full h-full overflow-hidden bg-black ring-4 ring-black/10 dark:ring-white/10 shadow-xl
        ${shapeClass}
      `}>
        {children}

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

        {/* OBS-style resize handle - bottom right corner */}
        {!isExpanded && (
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            onPointerDown={(e) => handleResizeStart(e, 'corner')}
            onPointerUp={handleResizeEnd}
          >
            {/* Corner resize indicator */}
            <div className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-white/60 rounded-br-sm" />
          </div>
        )}

        {/* Subtle border animation when dragging */}
        {isDragging && (
          <div className="absolute inset-0 rounded-inherit ring-2 ring-blue-500/50 pointer-events-none animate-pulse" />
        )}

        {/* Subtle border animation when resizing */}
        {isResizing && (
          <div className="absolute inset-0 rounded-inherit ring-2 ring-green-500/50 pointer-events-none animate-pulse" />
        )}
      </div>
    </div>
  );
}
