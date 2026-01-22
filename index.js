import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import readline from "readline";

//loads environment variables from .env
dotenv.config();

// Initialize Anthropic client with API key from environment variables
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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


async function main(){
    

    // Welcome message
    console.log("Welcome to the AI Secretary CLI!");
    console.log('Type your message and press Enter. Type "exit" to quit.\n');


    // Initialize conversation history array
    const conversationHistory = [];


    // Set up readline interface for user input
    const rl = readline.createInterface({input: process.stdin, output: process.stdout, prompt: "You: "});
    

    // Prompt the user for input
    rl.prompt();


    // Event listener for each line of user input
    rl.on('line', async (userInput) => {


        // handle exit command
        if (userInput.toLowerCase() === "exit") {
            console.log("Goodbye!");
            rl.close();
            return;
        }
        

        // Handle help command
        if (userInput.toLowerCase() === 'help') {
            showHelp();
            rl.prompt();
            return;
        }

        
        // Handle clear command
        if (userInput.toLowerCase() === 'clear') {
            conversationHistory.length = 0;
            console.log('\n✅ Conversation history cleared\n');
            rl.prompt();
            return;
        }


        // Handle tokens command
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

            // Prompt the user for the next input                       
            rl.prompt();


        } 
        catch (error) {  


            //general error handling          
            console.error("Error:", error.message);


        }


    });
}

main();