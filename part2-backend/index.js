//=============================================
// IMPORTS
// Import necessary modules and configurations
//=============================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import our config clients
import { supabase } from './config/supabase.js';
import { anthropic } from './config/anthropic.js';

// Import auth routes
import authRoutes from './routes/auth.js';

// Import conversation routes
import conversationRoutes from './routes/conversations.js';

// import authentication middleware
import { authenticateToken } from './middleware/auth.js';

// Import message routes
import messageRoutes from './routes/messages.js';




//=============================================
// MAIN SERVER SETUP
// Initializes and starts the Express server
//=============================================


// 1. Load environment variables
dotenv.config();

// 2. Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Activate Middleware
app.use(cors());
app.use(express.json());

// 4. Health check endpoint
app.get('/health', (req, res) => {
res.json({ status: 'ok', message: 'API is running' });
});

// 5. Test endpoint
app.get('/test', (req, res) => {
  res.send('Test works!');
});

// 6. Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});




// ============================================
// PROTECTED ROUTE TEST
// This endpoint requires a valid JWT token
// ============================================


app.get('/protected', authenticateToken, async (req, res) => {
  // If we get here, the token was valid!
  // req.user contains the authenticated user's info
  res.json({
    message: 'Access granted!',
    user: {
      id: req.user.id,
      email: req.user.email
    }
  });
});





//===========================================
// REGISTER ROUTES
// Handles user registration, login, and conversations
//===========================================


// register authentication routes
app.use('/auth', authRoutes);

// Register conversation routes
app.use('/conversations', conversationRoutes);
// Note: conversationRoutes applies auth middleware internally

// Register message routes
app.use('/conversations', messageRoutes);
// Note: messages are nested under conversations




//===========================================
// DATABASE CONNECTION TEST ENDPOINT
// Tests connection to Supabase database
//===========================================



app.get('/test-db', async (req, res) => {

  try {

    
    // Try to query the conversations table
    const { data, error } = await supabase
      .from('conversations')  // Query the conversations table
      .select('*')            // Select all columns
      .limit(1);              // Only get 1 row
    
    // If Supabase returned an error, throw it  
    if (error) throw error;
    
    // send success response
    res.json({ status: 'success', message: 'Database connected!',  tableExists: true });

  }   
  catch (error) {


      // send error response
      res.status(500).json({ status: 'error', message: error.message });
  

  }
});



//===========================================
// ANTHROPIC CONNECTION TEST ENDPOINT
// Tests connection to Anthropic API
//===========================================

app.get('/test-ai', async (req, res) => {
  
  try {


    // Make a simple request to the Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [{ role: 'user', content: 'Hello, Claude! How are you?' }]
    });

    // Send back the AI's response
    res.json({ status: 'success', message: 'AI connected successfully!', aiResponse: response.content[0].text, model: response.model });


  } 
  catch (error) {
    
    // Handle errors from the Anthropic API
    res.status(500).json({ status: 'error', message: error.message });

  }
});

