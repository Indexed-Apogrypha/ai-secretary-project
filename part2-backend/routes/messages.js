// ============================================
// MESSAGE ROUTES
// Handles sending messages to Claude and retrieving history
// ============================================




import express from 'express';
import { supabase } from '../config/supabase.js';
import { anthropic } from '../config/anthropic.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Secretary system prompt
const SYSTEM_PROMPT = `You are a professional personal secretary assistant. Your role is to:

- Draft professional emails, messages, and documents
- Create organized task lists and agendas
- Maintain a polite, professional, and helpful tone
- Be concise but thorough
- Anticipate needs and offer proactive suggestions

When drafting communications, use proper formatting and structure. When creating lists, organize them logically with priorities.`;



// ============================================
// GET /conversations/:conversationId/messages
// Gets all messages in a conversation
// ============================================




router.get('/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // First verify the conversation belongs to this user
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', req.user.id)
      .single();
    
    if (convError || !conversation) {
      return res.status(404).json({ 
        error: 'Conversation not found' 
      });
    }
    
    // Get all messages for this conversation
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });  // Chronological order
    
    if (msgError) throw msgError;
    
    // Return the messages
    res.json({
      messages: messages || []
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});




// ============================================
// POST /conversations/:conversationId/messages
// Sends a message to Claude and saves both messages
// ============================================




router.post('/:conversationId/messages', async (req, res) => {
  
    try {


        const { conversationId } = req.params;
        const { content } = req.body;
        

        // 1. Validate message content
        if (!content || !content.trim()) {
            return res.status(400).json({error: 'Message content is required'});
        }
        

        // 2. Verify conversation belongs to this user
        const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', req.user.id)
        .single();
        
        if (convError || !conversation) {
            return res.status(404).json({error: 'Conversation not found'});
        }
        

        // 3. Get conversation history (for context)
        const { data: history, error: histError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
        if (histError) throw histError;
        

        // 4a. Build messages array for Claude API and
        // 4b. Convert database format to Claude API format
        const conversationHistory = (history || []).map(msg => ({
        role: msg.role,
        content: msg.content
        }));
        

        // 5. Add the new user message
        conversationHistory.push({ role: 'user', content: content });
        

        // 6. Call Claude API
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: conversationHistory
        });
        
        const assistantMessage = response.content[0].text;
        

        // 7. Save user message to database
        const { data: userMsg, error: userError } = await supabase
        .from('messages')
        .insert([
            {
            conversation_id: conversationId,
            role: 'user',
            content: content,
            created_at: new Date().toISOString()
            }
        ])
        .select()
        .single();
        
        if (userError) throw userError;
        

        // 8. Save assistant message to database
        const { data: assistantMsg, error: assistantError } = await supabase
        .from('messages')
        .insert([
            {
            conversation_id: conversationId,
            role: 'assistant',
            content: assistantMessage,
            tokens_input: response.usage.input_tokens,
            tokens_output: response.usage.output_tokens,
            created_at: new Date().toISOString()
            }
        ])
        .select() 
        .single(); 
        
        if (assistantError) throw assistantError;
        

        // 9. Update conversation's updated_at timestamp
        await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
        

        // 10. Return both messages and token usage
        res.status(201).json({
        userMessage: userMsg,
        assistantMessage: assistantMsg,
        usage: {
            input_tokens: response.usage.input_tokens,
            output_tokens: response.usage.output_tokens
        }
        });
        



    } 
    catch (error) {


        res.status(500).json({ 
        error: error.message 
        });

    }
    
});

export default router;