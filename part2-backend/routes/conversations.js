// ============================================
// CONVERSATION ROUTES
// Handles CRUD operations for conversations
// ============================================


import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes in this file require authentication
// Apply the middleware to every route
router.use(authenticateToken);




// ============================================
// POST /conversations
// Creates a new conversation for the user
// ============================================


router.post('/', async (req, res) => {
    
  try {


    // 1. Get optional title from request body
    const { title } = req.body;
    
    // 2. Create conversation in database
    const { data, error } = await supabase
      .from('conversations')
      .insert([
        {

          user_id: req.user.id,   //comes from req.user (set by auth middleware)
          title: title || 'New Conversation',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          
        }
      ])
      .select()  // Return the created conversation
      .single(); // We only inserted one, so return single object
    

    // 3a throw error, return error message
    if (error) throw error;
    
    // 3b. Success! Return the new conversation
    res.status(201).json({
      message: 'Conversation created',
      conversation: data
    });
    

  } 

  catch (error) {
    
    
    res.status(500).json({ 
      error: error.message 
    });


  }


});




// ============================================
// GET /conversations
// Gets all conversations for the logged-in user
// ============================================


router.get('/', async (req, res) => {
  try {


    // 1. Query conversations for this user
    // RLS (Row Level Security) automatically filters by user_id
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', req.user.id)  // Only this user's conversations
      .order('updated_at', { ascending: false });  // Most recent first
    
    if (error) throw error;
    
    // 2. Return the list of conversations
    res.json({
      conversations: data
    });

    
  } 
  
  catch (error) {
    
    
    res.status(500).json({ 
      error: error.message 
    });


  }

});




// ============================================
// GET /conversations/:id
// Gets a single conversation by ID
// ============================================


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Query for this specific conversation
    // RLS ensures user can only access their own conversations
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)  // Security check
      .single();  // Expect exactly one result
    
    if (error) throw error;
    
    // If no conversation found, return 404
    if (!data) {
      return res.status(404).json({ 
        error: 'Conversation not found' 
      });
    }
    
    // Return the conversation
    res.json({
      conversation: data
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});




// ============================================
// DELETE /conversations/:id
// Deletes a conversation and all its messages
// ============================================


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete the conversation
    // CASCADE delete will automatically delete all messages
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);  // Security check
    
    if (error) throw error;
    
    // Success!
    res.json({
      message: 'Conversation deleted'
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

export default router;




// ============================================