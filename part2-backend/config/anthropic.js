// ============================================
// ANTHROPIC CLIENT CONFIGURATION
// Initializes the Claude API client
// ============================================

// Import the Anthropic SDK
import Anthropic from '@anthropic-ai/sdk';

// Import dotenv to load environment variables
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get API key from environment variables
const apiKey = process.env.ANTHROPIC_API_KEY;

// Validate that API key exists
// If it's missing, throw an error immediately
if (!apiKey) {
  throw new Error('Missing ANTHROPIC_API_KEY environment variable');
}

// Create and export the Anthropic client
// This client will be imported and used when calling Claude API
export const anthropic = new Anthropic({
  apiKey: apiKey,
});