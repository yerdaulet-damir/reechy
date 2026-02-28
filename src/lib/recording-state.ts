/**
 * Recording state management types and utilities
 * Centralizes the logic for handling different recording modes
 */

export enum RecordingMode {
  CAMERA_ONLY = 'camera-only',
  SCREEN_WITH_PIP = 'screen-with-pip'
}

export type VideoSource = 'camera' | 'screen';

export interface RecordingState {
  mode: RecordingMode;
  isRecording: boolean;
  canvasSize: { width: number; height: number };
  activeVideoSource: VideoSource;
}

export interface PipPosition {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage of container width
}

/**
 * Determines the recording mode based on whether screen share is active
 */
export function getRecordingMode(hasScreenShare: boolean): RecordingMode {
  return hasScreenShare ? RecordingMode.SCREEN_WITH_PIP : RecordingMode.CAMERA_ONLY;
}

/**
 * Gets the canvas dimensions based on the current recording mode
 */
export function getCanvasDimensions(
  mode: RecordingMode,
  cameraVideo?: HTMLVideoElement,
  screenVideo?: HTMLVideoElement
): { width: number; height: number } {
  if (mode === RecordingMode.SCREEN_WITH_PIP && screenVideo?.readyState && screenVideo.readyState >= 2) {
    return {
      width: screenVideo.videoWidth,
      height: screenVideo.videoHeight,
    };
  }

  if (cameraVideo?.readyState && cameraVideo.readyState >= 2) {
    return {
      width: cameraVideo.videoWidth,
      height: cameraVideo.videoHeight,
    };
  }

  // Default fallback dimensions
  return { width: 1280, height: 720 };
}

/**
 * Default PIP positions for different recording modes
 */
export const DEFAULT_PIP_POSITIONS: Record<RecordingMode, PipPosition> = {
  [RecordingMode.CAMERA_ONLY]: { x: 0, y: 0, width: 100 }, // Full screen (not used as PIP)
  [RecordingMode.SCREEN_WITH_PIP]: { x: 75, y: 75, width: 22 }, // Bottom-right corner
};

/**
 * Validates if a video element is ready to be drawn
 */
export function isVideoReady(video: HTMLVideoElement | null | undefined): boolean {
  return (
    video !== null &&
    video !== undefined &&
    video.readyState >= 2 && // HAVE_CURRENT_DATA or higher
    video.videoWidth > 0 &&
    video.videoHeight > 0
  );
}

/**
 * Validates if camera source is ready AND the track is enabled.
 * This prevents drawing a black PIP when camera track is disabled.
 * Like OBS Studio, we only draw active/enabled sources to the output.
 */
export function isCameraSourceReady(
  stream: MediaStream | null,
  video: HTMLVideoElement | null | undefined
): boolean {
  if (!stream || !video) return false;

  const videoTrack = stream.getVideoTracks()[0];
  if (!videoTrack || !videoTrack.enabled) return false;

  return (
    video.readyState >= 2 && // HAVE_CURRENT_DATA or higher
    video.videoWidth > 0 &&
    video.videoHeight > 0
  );
}

/**
 * Calculates PIP dimensions in pixels based on canvas size
 */
export function calculatePipDimensions(
  pipPosition: PipPosition,
  canvasWidth: number,
  canvasHeight: number,
  cameraAspectRatio: number
): { x: number; y: number; width: number; height: number } {
  const pipPxWidth = (pipPosition.width / 100) * canvasWidth;
  const pipPxHeight = pipPxWidth / cameraAspectRatio;
  const pipPxX = (pipPosition.x / 100) * canvasWidth;
  const pipPxY = (pipPosition.y / 100) * canvasHeight;

  return {
    x: pipPxX,
    y: pipPxY,
    width: pipPxWidth,
    height: pipPxHeight,
  };
}
