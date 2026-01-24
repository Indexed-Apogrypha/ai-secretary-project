// ============================================
// AUTHENTICATION MIDDLEWARE
// Verifies JWT tokens on protected routes
// ============================================

import { supabase } from '../config/supabase.js';



// ============================================
// Middleware function to verify JWT tokens
// This runs BEFORE protected route handlers
// ============================================


export const authenticateToken = async (req, res, next) => {
  
  
    try {


    // Get the Authorization header from the request
    // Format should be: "Bearer eyJhbGci..."
    const authHeader = req.headers['authorization'];
    

    // Extract just the token part (remove "Bearer " prefix)
    const token = authHeader && authHeader.split(' ')[1];
    

    // If no token provided, deny access
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }
    

    // Verify the token with Supabase
    // This checks if the token is valid and not expired
    const { data, error } = await supabase.auth.getUser(token);
    

    // If token is invalid or expired, deny access
    if (error || !data.user) {
      return res.status(403).json({ 
        error: 'Invalid or expired token' 
      });
    }
    

    // Token is valid! Attach user info to the request
    // Now route handlers can access req.user
    req.user = data.user;
    

    // Continue to the actual route handler
    next();
    

  } 
  catch (error) {


    // If anything goes wrong, deny access
    res.status(500).json({ 
      error: 'Failed to authenticate token' 
    });


  }
};