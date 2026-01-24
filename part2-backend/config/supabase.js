// ============================================
// SUPABASE CLIENT CONFIGURATION
// Initializes the Supabase client for database access
// ============================================

// Import the Supabase client library
import { createClient } from '@supabase/supabase-js';

// Import dotenv to load environment variables
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Validate that credentials exist
// If they're missing, throw an error immediately
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create and export the Supabase client
// This client will be imported and used throughout the API
// The service_role key gives full access (bypassing RLS for server operations)
export const supabase = createClient(supabaseUrl, supabaseKey);