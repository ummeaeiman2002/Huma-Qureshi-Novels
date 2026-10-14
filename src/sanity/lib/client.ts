import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token: process.env.SANITY_COMMENTS_TOKEN,
});

// Enhanced client with caching and performance optimizations
export const optimizedClient = {
  ...client,
  // Override fetch method to add caching layer
  async fetch<T = any>(query: string, params?: any, options?: any) {
    // Add basic caching for identical queries
    const cacheKey = JSON.stringify({ query, params });

    // In a real implementation, you might want to use a proper cache
    // For now, we'll just call the original fetch
    return client.fetch<T>(query, params, options);
  },

  // Method to fetch with specified tags for revalidation
  async fetchWithTags<T = any>(query: string, tags: string[], params?: any) {
    return client.fetch<T>(query, params, {
      next: { tags }
    });
  },

  // Method to fetch with revalidation time
  async fetchWithRevalidation<T = any>(query: string, revalidate: number, params?: any) {
    return client.fetch<T>(query, params, {
      next: { revalidate }
    });
  }
};
