import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import readline from "readline";


//==============================================================================//



//loads environment variables from .env
dotenv.config();

// Initialize Anthropic client with API key from environment variables
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Define system prompt for the AI secretary role
const SYSTEM_PROMPT = `You are a professional personal secretary assistant. Your role is to:

- Draft professional emails, messages, and documents
- Create organized task lists and agendas
- Maintain a polite, professional, and helpful tone
- Be concise but thorough
- Anticipate needs and offer proactive suggestions

When drafting communications, use proper formatting and structure. When creating lists, organize them logically with priorities.`;



//==============================================================================//


// Function to display token usage and cost
function displayTokenUsage(usage) {
    const inputTokens = usage.input_tokens;
    const outputTokens = usage.output_tokens;
    const totalTokens = inputTokens + outputTokens;
    
    // Claude Sonnet 4 pricing (per 1M tokens)
    const inputCost = (inputTokens / 1_000_000) * 3;
    const outputCost = (outputTokens / 1_000_000) * 15;
    const totalCost = inputCost + outputCost;
    
    console.log(`\n[[ Tokens: ${totalTokens} (in: ${inputTokens}, out: ${outputTokens})  |  Cost: $${totalCost.toFixed(6)} ]]\n`);
}

// Function to show help message
function showHelp() {
    console.log(`
        
        =================================== HELP ===================================

        AVAILABLE COMMANDS:

        exit     - Exit the application
        help     - Show this help message
        clear    - Clear conversation history
        tokens   - Show current conversation token estimate

        EXAMPLE PROMPTS:

        "Draft an email about tomorrow's meeting"
        "Create a task list for my project"

        ==========================================================================

        `);
}


//==============================================================================//


async function main(){
    

    // Welcome message
    console.log("Welcome to the AI Secretary CLI!");
    console.log('Type your message and press Enter. Type "exit" to quit.\n\n');


    // Initialize conversation history array
    const conversationHistory = [];


    // Set up readline interface for user input
    const rl = readline.createInterface({input: process.stdin, output: process.stdout, prompt: "You: "});
    

    // Prompt the user for input
    rl.prompt();


    // Event listener for each line of user input
    rl.on('line', async (userInput) => {


        // handle 'exit' command
        if (userInput.toLowerCase() === "exit") {
            console.log("Goodbye!");
            rl.close();
            return;
        }
        
        // Handle 'help' command
        if (userInput.toLowerCase() === 'help') {
            showHelp();
            rl.prompt();
            return;
        }
        
        // Handle 'clear' command
        if (userInput.toLowerCase() === 'clear') {
            conversationHistory.length = 0;
            console.log('\n✅ Conversation history cleared\n');
            rl.prompt();
            return;
        }

        // Handle 'tokens' command
        if (userInput.toLowerCase() === 'tokens') {
            const totalTokens = conversationHistory.reduce((sum, msg) => {
                return sum + Math.ceil(msg.content.length / 4);
            }, 0);
            console.log(`\n📊 Current conversation: ~${totalTokens} tokens (estimated)\n`);
            rl.prompt();
            return;
        }



        // Add user message to history
        conversationHistory.push({ role: 'user', content: userInput });

        // Try-catch: API request and response handling
        try {
            

            // Indicate that the system is processing
            process.stdout.write('⏳ Thinking...');

            // Make a request to the Anthropic API
            const message = await anthropic.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1024,
                system: SYSTEM_PROMPT,
                messages: conversationHistory                              
            });

            // Clear the "Thinking..." line
            process.stdout.write('\r\x1b[K');

            // Add Claude's response to history
            conversationHistory.push({role: 'assistant', content: message.content[0].text});

            // Output the response from Claude                       
            console.log("Claude:", message.content[0].text,"\n");

            // Display token usage            
            displayTokenUsage(message.usage);
            
            // add seperator line for readability
            console.log("==========================================\n");

            // Prompt the user for the next input                       
            rl.prompt();


        } 
        catch (error) {  


            // Remove failed user message from history
            conversationHistory.pop();
            
            // Clear loading indicator
            process.stdout.write('\r\x1b[K');
            


            // Handle specific error types
            if (error.status === 401) {
                console.error('\n❌ Authentication Error: Invalid API key');
                console.log('Please check your .env file\n');
            } 
                        
            else if (error.status === 429) {
                console.error('\n❌ Rate Limit: Too many requests');
                console.log('Please wait a moment before trying again\n');
            } 
            
            else if (error.status === 500) {
                console.error('\n❌ Server Error: Claude API is having issues');
                console.log('Please try again in a moment\n');
            } 
            
            else {
                console.error('\n❌ Error:', error.message, '\n');
            }
            

            // Prompt the user for the next input
            rl.prompt();


        }


    });
}

main();