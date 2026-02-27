'use server';

import { Redis } from '@upstash/redis';
import { nanoid } from 'nanoid';

// Initialize Redis directly matching Upstash docs
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function createShareableLink(videoUrl: string, title?: string) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error('Database configuration missing');
  }

  try {
    // Generate a 7-character short ID (e.g., 'aBx9qP2')
    const shortId = nanoid(7);
    
    // The data we want to store for the video card viewer
    const videoData = {
      videoUrl,
      title: title || 'Video Message',
      createdAt: Date.now(),
      views: 0,
    };

    // Save metadata to Upstash Redis
    await redis.set(`link:${shortId}`, videoData);

    // Return just the ID. The frontend can assemble the full URL (e.g. outrache.com/v/{shortId})
    return { success: true, id: shortId };
  } catch (error) {
    console.error('Failed to save to Upstash:', error);
    return { success: false, error: 'Database error' };
  }
}

export async function getVideoData(shortId: string) {
  try {
    const data = await redis.get<{ videoUrl: string; title: string; createdAt: number; views: number }>(`link:${shortId}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch from Upstash:', error);
    return null;
  }
}

export async function trackVideoView(shortId: string) {
  try {
    // Increment the views counter concurrently
    await redis.incr(`link:${shortId}:views`);
  } catch (error) {
    console.error('Failed to increment view count:', error);
  }
}
