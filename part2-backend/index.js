import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import our config clients
import { supabase } from './config/supabase.js';
import { anthropic } from './config/anthropic.js';



//=============================================
// MAIN SERVER SETUP
// Initializes and starts the Express server
//=============================================



  // Load environment variables
  dotenv.config();

  // Initialize Express app
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
  });

  // Test endpoint
  app.get('/test', (req, res) => {
    res.send('Test works!');
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });


//=============================================



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

//=============================================



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

//===========================================