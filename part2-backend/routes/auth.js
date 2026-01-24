// ============================================
// AUTHENTICATION ROUTES
// Handles user registration and login
// ============================================



import express from 'express';
import { supabase } from '../config/supabase.js';

// Create a router for auth endpoints
const router = express.Router();




// ============================================
// POST /auth/register
// Creates a new user account
// ============================================

router.post('/register', async (req, res) => {
  try {


    // 1. Get email and password from request body
    const { email, password } = req.body;
    

    // 2. Validate that both fields are provided
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }


    // 3. Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    

    // 4a. If there's an error, return it
    if (error) throw error;
    

    // 4b. Return the user info (no password)
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });

    
  } 
  catch (error) {


    // error handling
    res.status(400).json({ 
      error: error.message 
    });


  }
});

// ============================================






// ============================================
// POST /auth/login
// Logs in a user and returns JWT token
// ============================================

router.post('/login', async (req, res) => {

  try {


    // 1. Get email and password from request body
    const { email, password } = req.body;
    

    // 2. Validate that both fields are provided
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    

    // 3. Attempt to sign in with Supabase Auth
    // This verifies the password and returns a JWT token
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    

    // 4a. If there's an error (wrong password, user doesn't exist, etc.)
    if (error) throw error;
    
    
    // 4b. Success! Return the JWT token and user info
    res.json({
      message: 'Login successful',
      token: data.session.access_token,  // JWT token for future requests
      user: { id: data.user.id, email: data.user.email }
    });

    
  } 
  catch (error) {


    // Handle any errors (wrong credentials, etc.)
    res.status(401).json({ 
      error: error.message 
    });

    
  }
});

// Export the router so it can be used in index.js
export default router;